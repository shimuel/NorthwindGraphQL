using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class TerritoryType : ObjectGraphType<Territory>
    {
        public TerritoryType()
        {
            Field(x => x.TerritoryId,false);
            Field(x => x.TerritoryDescription,true);
            Field(x => x.RegionId,true);            
            Field(x => x.Region, false, type: typeof(RegionType)).Description("Region");
            Field(x => x.EmployeeTerritories,true, type: typeof(ListGraphType<EmployeeTerritoryType>)).Description("EmployeeTerritories");
        }
    }

    public class TerritoryTypeInputType : InputObjectGraphType
    {
        public TerritoryTypeInputType()
        {
                Name = "TerritoryInput";
                Field<NonNullGraphType<IntGraphType>>("TerritoryId");
                Field<NonNullGraphType<StringGraphType>>("TerritoryDescription");
        }
    }    
}