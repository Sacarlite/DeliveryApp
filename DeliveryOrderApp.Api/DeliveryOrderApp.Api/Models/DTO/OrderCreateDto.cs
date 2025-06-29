using System.ComponentModel.DataAnnotations;

namespace DeliveryOrderApp.Api.Models.DTO
{
    public class OrderCreateDto
    {

        [Required]
        public string SenderCity { get; set; }

        [Required]
        public string SenderAddress { get; set; }

        [Required]
        public string PickupDate { get; set; }

        [Required]
        public string RecipientCity { get; set; }

        [Required]
        public string RecipientAddress { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Вес груза должен быть положительным числом.")]
        public double CargoWeight { get; set; }
    }
}
