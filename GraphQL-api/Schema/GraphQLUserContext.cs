using System.Security.Claims;

namespace GraphQL_api.Schema
{
    public class GraphQLUserContext
    {
        public ClaimsPrincipal User { get; set; }
    }
}