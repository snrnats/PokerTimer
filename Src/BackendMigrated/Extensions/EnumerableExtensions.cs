using System.Collections.ObjectModel;

namespace PokerTimer.Api.Extensions
{
    public static class EnumerableExtensions
    {
        public static ReadOnlyCollection<T> ToReadOnly<T>(this IEnumerable<T> source)
        {
            if (source is ReadOnlyCollection<T> collection)
            {
                return collection;
            }

            if (source is IList<T> list)
            {
                return new ReadOnlyCollection<T>(list);
            }

            return new ReadOnlyCollection<T>(source.ToArray());
        }
    }
}