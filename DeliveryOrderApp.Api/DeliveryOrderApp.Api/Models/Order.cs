using System.ComponentModel.DataAnnotations;

namespace DeliveryOrderApp.Api.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        [Required]
        public string SenderCity { get; set; }
        [Required]
        public string SenderAddress { get; set; }
        [Required]
        public string RecipientCity { get; set; }
        [Required]
        public string RecipientAddress { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Вес должен быть больше 0")]
        public double CargoWeight { get; set; }
        [Required]
        public DateTime PickupDate { get; set; }
    }
}
