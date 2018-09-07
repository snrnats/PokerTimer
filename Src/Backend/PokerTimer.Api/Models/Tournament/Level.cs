using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using PokerTimer.Api.Utils.JsonConverters;

namespace PokerTimer.Api.Models.Tournament
{
    public class Level
    {
        public Level(int index, int smallBlind, int bigBlind, int ante,TimeSpan duration)
        {
            Index = index;
            Duration = duration;
            SmallBlind = smallBlind;
            BigBlind = bigBlind;
            Ante = ante;
        }

        public Level()
        {
        }

        [JsonIgnore]
        public int Id { get; set; }
        [JsonIgnore]
        public int Index { get; set; }
        [JsonIgnore]
        public int SetupId { get; set; }
        [JsonConverter(typeof(TimeSpanJsonConverter), TimeSpan.TicksPerSecond)]
        public TimeSpan Duration { get; set; }
        [Range(1,100)]
        public int SmallBlind { get; set; }
        public int BigBlind { get; set; }
        public int Ante { get; set; }
    }
}