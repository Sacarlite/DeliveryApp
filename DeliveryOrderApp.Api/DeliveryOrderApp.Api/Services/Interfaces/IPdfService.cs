using DeliveryOrderApp.Api.Models;

namespace DeliveryOrderApp.Api.Services.Interfaces
{
    public interface IPdfService
    {
        public byte[] GenerateOrderPdf(Order order);
    }
}