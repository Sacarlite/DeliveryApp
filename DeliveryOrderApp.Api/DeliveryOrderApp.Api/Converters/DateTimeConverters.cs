using System.Globalization;

namespace DeliveryOrderApp.Api.Converters
{
    public static class DateTimeConverters
    {
        public static DateTime ConvertStringToUtcDateTime(string dateString)
        {
                return DateTime.SpecifyKind(DateTime.ParseExact(dateString, "yyyy-MM-dd", CultureInfo.InvariantCulture,
                                       DateTimeStyles.None), DateTimeKind.Utc);
        }
    }
}
