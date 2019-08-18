using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class RegionType : ObjectGraphType<Region>
    {
        public RegionType()
        {
            Field(x => x.RegionId,false);
            Field(x => x.RegionDescription,true);         
            Field(x => x.Territories,true, type: typeof(ListGraphType<TerritoryType>)).Description("Territories");
        }
    }

    public class RegionTypeInputType : InputObjectGraphType
    {
        public RegionTypeInputType()
        {
                Name = "RegionInput";
                Field<NonNullGraphType<IntGraphType>>("RegionId");
                Field<NonNullGraphType<StringGraphType>>("RegionDescription");
        }
    }    
}