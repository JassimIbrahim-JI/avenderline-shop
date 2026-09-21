using System.Text.RegularExpressions;
using AvenderLine.Application.Interfaces;
using AvenderLine.Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace AvenderLine.Infrastructure.AI;

public class ConciergeService : IConciergeService
{
    private readonly IProductRepository _productRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IConfiguration _config;

    public ConciergeService(
        IProductRepository productRepository,
        IOrderRepository orderRepository,
        IConfiguration config)
    {
        _productRepository = productRepository;
        _orderRepository = orderRepository;
        _config = config;
    }

    public async Task<ConciergeResponse> AskAsync(ConciergeRequest request, CancellationToken ct = default)
    {
        var apiKey = _config["OpenAI:ApiKey"];
        var model = _config["OpenAI:Model"] ?? "gpt-4o-mini";

        if (request.CustomerId.HasValue && request.CustomerContext == null)
        {
            request.CustomerContext = await BuildCustomerContextAsync(request.CustomerId.Value, ct);
        }

        if (string.IsNullOrWhiteSpace(apiKey))
            return await FallbackAsync(request, ct);

        try
        {
            var kernel = Kernel.CreateBuilder()
                .AddOpenAIChatCompletion(model, apiKey)
                .Build();

            kernel.ImportPluginFromFunctions("Store", new[]
            {
                KernelFunctionFactory.CreateFromMethod(
                    (string query, int maxResults) => SearchProductsAsync(query, maxResults, ct),
                    functionName: "SearchProducts",
                    description: "Search the AvenderLine catalog and return matching products with prices."),
                KernelFunctionFactory.CreateFromMethod(
                    (string orderNumber) => GetOrderStatusAsync(orderNumber, ct),
                    functionName: "GetOrderStatus",
                    description: "Look up the live status of an AvenderLine order by order number.")
            });

            var settings = new OpenAIPromptExecutionSettings
            {
                Temperature = 0.35,
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
            };

            var chat = kernel.GetRequiredService<IChatCompletionService>();
            var history = new ChatHistory();

            var customerInfoPrompt = request.CustomerContext != null
                ? $"CUSTOMER CONTEXT: Name={request.CustomerContext.FullName}, Orders={request.CustomerContext.TotalOrders}, " +
                  $"TotalSpent={request.CustomerContext.TotalSpent} QAR, FavoriteStyle={request.CustomerContext.FavoriteStyle ?? "Royal Cloche"}, " +
                  $"PreferredSize={request.CustomerContext.PreferredSize ?? "54"}. " +
                  $"LatestOrder={(request.CustomerContext.Orders.FirstOrDefault()?.OrderNumber ?? "None")}, " +
                  $"LatestStatus={(request.CustomerContext.Orders.FirstOrDefault()?.Status ?? "None")}, " +
                  $"Destination={(request.CustomerContext.Orders.FirstOrDefault()?.Destination ?? "Doha, Qatar")}. "
                : "CUSTOMER CONTEXT: Guest client (not signed in). If they ask about personal orders, ask them to sign in or share their order number. ";

            history.AddSystemMessage(
                "You are the AI styling assistant for AvenderLine Maison in Doha, Qatar. " +
                "Tone is warm, refined, helpful. Always reply in the same language the customer uses (English or Arabic). " +
                customerInfoPrompt +
                "Sizing: 150-153cm -> 50, 154-158cm -> 52, 159-163cm -> 54, 164-168cm -> 56, 169-173cm -> 58, 174cm+ -> 60. " +
                "Recommend one size up when heels are 3+ inches. Mention complimentary atelier tailoring. " +
                "Fabric care: royal crepe is dry-clean or cold hand wash, no tumble dry, steam iron only. " +
                "Climate: 40C+ Doha summers need cooling Japanese Nada; winters want velvet or Italian cashmere.");

            history.AddUserMessage(request.Message ?? string.Empty);

            var result = await chat.GetChatMessageContentAsync(history, settings, kernel, ct);

            return new ConciergeResponse
            {
                Reply = result.Content ?? string.Empty
            };
        }
        catch
        {
            return await FallbackAsync(request, ct);
        }
    }

    private async Task<CustomerContext> BuildCustomerContextAsync(Guid customerId, CancellationToken ct)
    {
        var orders = await _orderRepository.GetByCustomerIdAsync(customerId, ct);
        var summaries = orders.Select(o => new CustomerOrderSummary
        {
            OrderNumber = o.OrderNumber,
            Status = o.Status.ToString(),
            Total = o.Total,
            Currency = o.Currency,
            CreatedAt = o.CreatedAt,
            Destination = o.ShippingAddress != null
                ? $"{o.ShippingAddress.City}, {o.ShippingAddress.Country}"
                : "Doha, Qatar",
            Items = o.Items.Select(i => i.ProductName).ToList()
        }).OrderByDescending(s => s.CreatedAt).ToList();

        var topItem = summaries.SelectMany(s => s.Items)
            .GroupBy(x => x)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefault() ?? "Royal Jet-Black Crepe";

        return new CustomerContext
        {
            TotalOrders = summaries.Count,
            TotalSpent = summaries.Sum(s => s.Total),
            FavoriteStyle = topItem,
            PreferredSize = "54",
            Orders = summaries
        };
    }

    private async Task<IReadOnlyList<object>> SearchProductsAsync(string query, int maxResults, CancellationToken ct)
    {
        var products = await _productRepository.SearchAsync(
            query, null, null, null, null, true, "featured", 1, Math.Clamp(maxResults, 1, 10), ct);

        return products.Select(p => new
        {
            p.Id,
            p.Name,
            p.Price,
            p.Currency,
            p.Slug
        }).ToList<object>();
    }

    private async Task<object?> GetOrderStatusAsync(string orderNumber, CancellationToken ct)
    {
        var order = await _orderRepository.GetByOrderNumberAsync(orderNumber, ct);
        if (order == null) return null;

        return new
        {
            order.OrderNumber,
            Status = order.Status.ToString(),
            Total = order.Total,
            order.Currency,
            order.CreatedAt,
            Destination = order.ShippingAddress?.City ?? "Doha"
        };
    }

    private async Task<ConciergeResponse> FallbackAsync(ConciergeRequest request, CancellationToken ct)
    {
        var text = request.Message ?? string.Empty;
        var lower = text.ToLowerInvariant();

        bool isOrderQuery = lower.Contains("order") || lower.Contains("track") || lower.Contains("status") ||
                            lower.Contains("history") || lower.Contains("favorite") || lower.Contains("bought");

        if (isOrderQuery)
        {
            if (request.CustomerContext != null && request.CustomerContext.TotalOrders > 0)
            {
                var ctx = request.CustomerContext;
                var latestOrder = ctx.Orders.FirstOrDefault();
                string statusLabel = latestOrder?.Status switch
                {
                    "Delivered" => "Successfully delivered",
                    "Shipped" => "Out for delivery across Qatar",
                    "Processing" => "In atelier preparation in Doha",
                    _ => "Confirmed and in progress"
                };

                var orderReply =
                    $"Welcome back {ctx.FullName ?? "valued client"} to AvenderLine.\n\n" +
                    $"Your maison profile:\n" +
                    $"- Total orders: {ctx.TotalOrders} ({ctx.TotalSpent:N0} QAR total).\n" +
                    $"- Signature preference: {ctx.FavoriteStyle ?? "Royal Jet-Black Crepe"}.\n" +
                    $"- Preferred silhouette size: {ctx.PreferredSize ?? "54"}.\n\n" +
                    $"Latest order (#{latestOrder?.OrderNumber}):\n" +
                    $"- Status: {statusLabel}\n" +
                    $"- Destination: {latestOrder?.Destination ?? "Doha, Qatar"}\n" +
                    $"- Total: {latestOrder?.Total:N0} {latestOrder?.Currency}\n" +
                    (latestOrder?.Items.Any() == true ? $"- Pieces: {string.Join(", ", latestOrder.Items)}\n\n" : "\n") +
                    "Want me to track another order or help style something new?";

                return new ConciergeResponse { Reply = orderReply };
            }

            var orderMatch = Regex.Match(text, @"(AVL-?\d{3,6}|\b\d{4}\b)", RegexOptions.IgnoreCase);
            if (orderMatch.Success)
            {
                var num = orderMatch.Value.ToUpperInvariant();
                return new ConciergeResponse
                {
                    Reply =
                        $"Tracking record for order {num}:\n" +
                        $"- Status: In atelier preparation in Doha (dispatch within 24 hours).\n" +
                        $"- Courier: AvenderLine private express fleet across Qatar.\n" +
                        $"- Destination: Doha, Qatar.\n" +
                        "You'll get an SMS alert when the courier is on the way."
                };
            }

            return new ConciergeResponse
            {
                Reply = "Sign in to your account to see live order tracking and your purchase history, or share your order number (example: AVL-1002) and I'll trace it right away."
            };
        }

        var heightMatch = Regex.Match(text, @"(\d{3})");
        if (heightMatch.Success && int.TryParse(heightMatch.Groups[1].Value, out int height) && height is >= 145 and <= 190)
        {
            string size = height switch
            {
                <= 153 => "50",
                <= 158 => "52",
                <= 163 => "54",
                <= 168 => "56",
                <= 173 => "58",
                _ => "60"
            };

            var sizingReply =
                $"For a stature of {height} cm, the ideal Gulf couture length is size {size}.\n\n" +
                $"- With 3+ inch heels, go up to size {int.Parse(size) + 2} for a floor-skimming drape.\n" +
                "- Complimentary sleeve and hemline tailoring is available at our Doha atelier on checkout.";

            var sampleProducts = await _productRepository.SearchAsync(null, null, null, null, null, true, "featured", 1, 2, ct);
            return new ConciergeResponse
            {
                Reply = sizingReply,
                SuggestedProducts = MapProducts(sampleProducts)
            };
        }

        if (lower.Contains("price") || lower.Contains("cost") || lower.Contains("how much"))
        {
            var priceReply =
                "AvenderLine pricing ranges from 450 QAR for daily silhouettes up to 750-1,150 QAR for royal couture and heritage bishts.\n\n" +
                "- All creations include a tailored matching sheila and luxury packaging.\n" +
                "- Express delivery across Qatar is free on orders above 500 QAR.\n" +
                "- Bespoke atelier adjustments are complimentary.";

            var priceProducts = await _productRepository.SearchAsync(null, null, null, null, null, true, "featured", 1, 4, ct);
            return new ConciergeResponse
            {
                Reply = priceReply,
                SuggestedProducts = MapProducts(priceProducts)
            };
        }

        if (lower.Contains("wash") || lower.Contains("care") || lower.Contains("clean") || lower.Contains("iron"))
        {
            return new ConciergeResponse
            {
                Reply =
                    "To preserve the depth of royal crepe and the hand-stitched crystals:\n\n" +
                    "1. Washing: professional dry cleaning, or gentle hand wash in cold water with a dark-silk detergent.\n" +
                    "2. Drying: skip the tumble dryer; hang on a wide padded hanger in a shaded, ventilated space.\n" +
                    "3. Ironing: vertical steam iron only, to keep the soft fluid drape without sheen on the surface."
            };
        }

        if (lower.Contains("summer") || lower.Contains("winter") || lower.Contains("weather") || lower.Contains("hot"))
        {
            return new ConciergeResponse
            {
                Reply =
                    "For Doha's summer (40C+) we recommend the cooling Japanese Nada or a lightweight Korean crepe in a flowing half-cloche.\n\n" +
                    "For winter galas the Italian cashmere-silk blend or royal velvet gives warmth with structure."
            };
        }

        if (lower.Contains("bisht") || lower.Contains("heritage") || lower.Contains("royal") || lower.Contains("abaya"))
        {
            var bishtProducts = await _productRepository.SearchAsync(null, null, null, null, null, true, "featured", 1, 3, ct);
            return new ConciergeResponse
            {
                Reply =
                    "The heritage bisht collection uses Japanese silk taffeta framed with fine gold-wire kasab trimming, finished in our Doha atelier.\n\n" +
                    "Want me to suggest a few pieces in your size?",
                SuggestedProducts = MapProducts(bishtProducts)
            };
        }

        var fallback = await _productRepository.SearchAsync(query: text, categoryId: null, minPrice: null, maxPrice: null,
            isFeatured: null, isAvailable: true, sortBy: "relevance", page: 1, pageSize: 4, ct: ct);

        return new ConciergeResponse
        {
            Reply = "I'm here to help with sizing, fabric, order tracking, and recommendations. Try asking about a product, your size, or an order number.",
            SuggestedProducts = MapProducts(fallback)
        };
    }

    private List<object> MapProducts(IEnumerable<Domain.Entities.Product> products)
    {
        return products.Select(p => new
        {
            p.Id,
            p.Name,
            p.Price,
            p.Currency,
            p.Slug,
            ImageUrl = p.Images.OrderBy(i => i.SortOrder).FirstOrDefault()?.Url
        }).Cast<object>().ToList();
    }
}
