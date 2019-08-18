using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class EmployeeTerritoryType : ObjectGraphType<EmployeeTerritory>
    {
        public EmployeeTerritoryType()
        {
            Field(x => x.EmployeeId,false);
            Field(x => x.TerritoryId,false);
            Field(x => x.Employee,true,type: typeof(EmployeeType)).Description("Employee");
            Field(x => x.Territory,true, type: typeof(TerritoryType)).Description("Territory");
        }
    }

    public class EmployeeTerritoryTypeInputType : InputObjectGraphType
    {
        public EmployeeTerritoryTypeInputType()
        {
                Name = "EmployeeTerritoryInput";
                Field<NonNullGraphType<IntGraphType>>("EmployeeId");
                Field<NonNullGraphType<IntGraphType>>("TerritoryId");
        }
    }    
}