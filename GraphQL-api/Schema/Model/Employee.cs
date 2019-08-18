using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class EmployeeType : ObjectGraphType<Employee>
    {
        public EmployeeType()
        {
            Field(x => x.EmployeeId,false);
            Field(x => x.LastName,true);
            Field(x => x.FirstName,true);            
            Field(x => x.Title,true);
            Field(x => x.TitleOfCourtesy,true);
            Field(x => x.BirthDate,true);
            Field(x => x.HireDate,true);
            Field(x => x.Address,true);
            Field(x => x.City,true);
            Field(x => x.Region,true);
            Field(x => x.PostalCode,false);
            Field(x => x.Country,true);
            Field(x => x.HomePhone,true);            
            Field(x => x.Extension,true);
            //Field(x => x.Photo,true);
            Field(x => x.Notes,true);
            Field(x => x.ReportsTo,true);
            Field(x => x.PhotoPath,true);
            Field(x => x.InverseEmployee,true, type: typeof(EmployeeType)).Description("Manager");
            Field(x => x.EmployeeTerritories,true, type: typeof(ListGraphType<EmployeeTerritoryType>)).Description("Territories");
            Field(x => x.Orders,true, type: typeof(ListGraphType<OrderType>)).Description("Orders");
        }
    }

    public class EmployeeTypeInputType : InputObjectGraphType
    {
        public EmployeeTypeInputType()
        {
                Name = "EmployeeInput";
                Field<NonNullGraphType<IntGraphType>>("EmployeeId");
                Field<NonNullGraphType<StringGraphType>>("LastName");
                Field<StringGraphType>("FirstName");
                Field<StringGraphType>("Title");
                Field<StringGraphType>("TitleOfCourtesy");
                Field<StringGraphType>("BirthDate");
                Field<StringGraphType>("HireDate");
                Field<StringGraphType>("Address");
                Field<StringGraphType>("City");
                Field<StringGraphType>("Region");
                Field<StringGraphType>("PostalCode");
                Field<StringGraphType>("Country");
                Field<StringGraphType>("HomePhone");
                Field<StringGraphType>("Extension");
                //Field<StringGraphType>("Photo");
                Field<StringGraphType>("Notes");
                Field<StringGraphType>("PhotoPath");
        }
    }    
}