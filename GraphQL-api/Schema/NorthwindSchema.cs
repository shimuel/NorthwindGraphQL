using System;
using System.Collections.Generic;
using GraphQL;
//using GraphQL.Types;

namespace GraphQL_api.Schema
{
    public class NorthwindSchema : GraphQL.Types.Schema
    {
        public NorthwindSchema(IDependencyResolver resolver): base(resolver)
        {
            Query = resolver.Resolve<NorthwindQuery>();
            Mutation = resolver.Resolve<NorthwindMutation>();
        }
    }
}