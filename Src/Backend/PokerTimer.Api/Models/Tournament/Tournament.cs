using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using PokerTimer.Api.Utils.JsonConverters;

namespace PokerTimer.Api.Models.Tournament
{
    public class Tournament
    {
        public int Id { get; set; }
        public string OwnerId { get; set; }
        public string Title { get; set; }

        [JsonConverter(typeof(TimeSpanJsonConverter), TimeSpan.TicksPerSecond)]
        public TimeSpan PauseDuration { get; set; }

        [JsonIgnore]
        public int SetupId { get; set; }
        public Setup Setup { get; set; }

        //public int LevelIndex { get; set; }
        //public DateTimeOffset LevelStartTime { get; set; }
        
    }
}