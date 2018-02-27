using System;
using Newtonsoft.Json;

namespace PokerTimer.Api.Utils.JsonConverters
{
    public class TimeSpanJsonConverter : JsonConverter
    {
        private readonly long _tickRatio;

        public TimeSpanJsonConverter(long tickRatio)
        {
            _tickRatio = tickRatio;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var ts = (TimeSpan) value;
            writer.WriteValue(ts.Ticks / _tickRatio);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var value = reader.ReadAsInt32().GetValueOrDefault(0);
            return new TimeSpan(value * _tickRatio);
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(TimeSpan);
        }
    }
}