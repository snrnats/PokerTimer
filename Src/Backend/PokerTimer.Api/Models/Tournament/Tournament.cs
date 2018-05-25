using System;
using Newtonsoft.Json;
using PokerTimer.Api.Utils.JsonConverters;

namespace PokerTimer.Api.Models.Tournament
{
    public class Tournament
    {
        public int Id { get; set; }
        public string OwnerId { get; set; }
        public string Title { get; set; }

        public DateTimeOffset StartDate { get; set; }

        [JsonConverter(typeof(TimeSpanJsonConverter), TimeSpan.TicksPerSecond)]
        public TimeSpan PauseDuration { get; set; }

        public bool IsPaused { get; set; }

        [JsonIgnore]
        public DateTimeOffset? PauseStart { get; set; }
        
        public int SetupId { get; set; }

        public Setup Setup { get; set; }
    }
}