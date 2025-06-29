using DeliveryOrderApp.Api.Models;
using DeliveryOrderApp.Api.Services.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace DeliveryOrderApp.Api.Services
{
    public class PdfGenerationService : IPdfService
    {
        public byte[] GenerateOrderPdf(Order order)
        {
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order), "Неверные данные заказа для генерации отчёта.");
            }

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(36);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Text($"Отчет по Заказу № {order.Id}")
                        .FontSize(20)
                        .SemiBold()
                        .FontColor(Colors.Blue.Medium)
                        .AlignCenter();

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            column.Spacing(10);

                            column.Item().Text(text =>
                            {
                                text.Span("Номер заказа: ").SemiBold();
                                text.Span(order.Id.ToString());
                            });
                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Column(col =>
                                {
                                    col.Spacing(5);
                                    col.Item().Text("Данные отправителя:").SemiBold().Underline();
                                    col.Item().Text($"Город: {order.SenderCity}");
                                    col.Item().Text($"Адрес: {order.SenderAddress}");
                                });

                                row.RelativeItem().Column(col =>
                                {
                                    col.Spacing(5);
                                    col.Item().Text("Данные получателя:").SemiBold().Underline();
                                    col.Item().Text($"Город: {order.RecipientCity}");
                                    col.Item().Text($"Адрес: {order.RecipientAddress}");
                                });
                            });

                            column.Item().Text(text =>
                            {
                                text.Span("Вес груза: ").SemiBold();
                                text.Span($"{order.CargoWeight} кг");
                            });

                            column.Item().Text(text =>
                            {
                                text.Span("Дата забора: ").SemiBold();
                                text.Span(order.PickupDate.ToString("dd.MM.yyyy"));
                            });

                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Страница ");
                            x.CurrentPageNumber();
                            x.Span(" из ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }
    }
}
