using System;
using Newtonsoft.Json;
using PokerTimer.Api.Utils.JsonConverters;

namespace PokerTimer.Api.Models.Tournament
{
    public class Tournament : IEquatable<Tournament>
    {
        public int Id { get; set; }
        public string OwnerId { get; set; }
        public string Title { get; set; }

        public DateTimeOffset StartDate { get; set; }

        [JsonConverter(typeof(TimeSpanJsonConverter), TimeSpan.TicksPerSecond)]
        public TimeSpan PauseDuration { get; set; }

        public bool IsPaused => PauseStart != null;
        
        public DateTimeOffset? PauseStart { get; set; }
        
        public int SetupId { get; set; }

        public Setup Setup { get; set; }

        public bool Equals(Tournament other)
        {
            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return Id == other.Id && string.Equals(OwnerId, other.OwnerId) && string.Equals(Title, other.Title) && StartDate.Equals(other.StartDate) && PauseDuration.Equals(other.PauseDuration) && PauseStart.Equals(other.PauseStart) && SetupId == other.SetupId && Equals(Setup, other.Setup);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj))
            {
                return false;
            }

            if (ReferenceEquals(this, obj))
            {
                return true;
            }

            if (obj.GetType() != this.GetType())
            {
                return false;
            }

            return Equals((Tournament) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = Id;
                hashCode = (hashCode * 397) ^ (OwnerId != null ? OwnerId.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ (Title != null ? Title.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ StartDate.GetHashCode();
                hashCode = (hashCode * 397) ^ PauseDuration.GetHashCode();
                hashCode = (hashCode * 397) ^ PauseStart.GetHashCode();
                hashCode = (hashCode * 397) ^ SetupId;
                hashCode = (hashCode * 397) ^ (Setup != null ? Setup.GetHashCode() : 0);
                return hashCode;
            }
        }
    }
}