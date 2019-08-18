using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class SupplierType : ObjectGraphType<Supplier>
    {
        public SupplierType()
        {            
            Field(x => x.SupplierId,false);
            Field(x => x.CompanyName,true);
            Field(x => x.ContactName,true);            
            Field(x => x.ContactTitle,true);
            Field(x => x.Address,true);
            Field(x => x.City,true);
            Field(x => x.Country,true);
            Field(x => x.Region,true);
            Field(x => x.Fax,true);
            Field(x => x.Phone,true);
            Field(x => x.HomePage,true);
            Field(x => x.Products,true, type: typeof(ListGraphType<ProductType>)).Description("Product");
        }
    }

    public class SupplierTypeInputType : InputObjectGraphType
    {
        public SupplierTypeInputType()
        {
                Name = "SupplierInput";
                Field<NonNullGraphType<IntGraphType>>("SupplierId");
                Field<NonNullGraphType<StringGraphType>>("CompanyName");
                Field<StringGraphType>("ContactName");
                Field<StringGraphType>("ContactTitle");
                Field<StringGraphType>("Address");
                Field<StringGraphType>("City");
                Field<StringGraphType>("Country");
                Field<StringGraphType>("Region");
                Field<StringGraphType>("Fax");
                Field<StringGraphType>("Phone");
                Field<StringGraphType>("HomePage");
        }
    }    
}