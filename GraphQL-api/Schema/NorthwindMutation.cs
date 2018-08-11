
using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Types;

namespace GraphQL_api.Schema
{
    public class NorthwindMutation : ObjectGraphType
    {
        public NorthwindMutation(Db.OrderRepo data)
        {
            // Field<HumanType>(
            // "createHuman",
            // arguments: new QueryArguments(
            //     new QueryArgument<NonNullGraphType<HumanInputType>> {Name = "human"}
            // ),
            // resolve: context =>
            // {
            //     var human = context.GetArgument<Human>("human");
            //     return data.AddHuman(human);
            // });
        }
    }
}