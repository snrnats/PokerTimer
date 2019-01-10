using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using PokerTimer.Api.Auth;

namespace PokerTimer.Api.Models.Tournament
{
    public class Setup
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string OwnerId { get; set; }
        public PokerUser Owner { get; set; }
        [JsonIgnore]
        public bool AddToFavorites { get; set; }

        public int StartingChips { get; set; }
        public int NumberOfPlayers { get; set; }

        public bool IsInfinite { get; set; }
        public float? InfiniteMultiplier { get; set; }

        public List<Level> Levels { get; set; }
    }
}