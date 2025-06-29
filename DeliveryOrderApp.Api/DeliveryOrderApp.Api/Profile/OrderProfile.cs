using DeliveryOrderApp.Api.Converters;
using DeliveryOrderApp.Api.Models;
using DeliveryOrderApp.Api.Models.DTO;
namespace DeliveryOrderApp.Api.Profile
{
    public class OrderProfile : AutoMapper.Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderCreateDto, Order>()
            .ForMember(
                dest => dest.PickupDate,
                opt => opt.MapFrom(src => DateTimeConverters.ConvertStringToUtcDateTime(src.PickupDate))
            );
        }
    }
}
