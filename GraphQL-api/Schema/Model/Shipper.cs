using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class ShipperType : ObjectGraphType<Shipper>
    {
        public ShipperType(IUnitOfWork uow)
        {
            //Field(x => x.CustomerId,type: typeof(IdGraphType)).Description("Customer's Id");
            Field(x => x.ShipperId,false);
            Field(x => x.CompanyName,true);
            Field(x => x.Phone,true);
            Field(x => x.Orders,true, type: typeof(ListGraphType<OrderType>)).Description("Customer Demographics");
        }
    }

    public class ShipperTypeInputType : InputObjectGraphType
    {
        public ShipperTypeInputType()
        {
                Name = "ShipperInput";
                Field<NonNullGraphType<IntGraphType>>("CustomerId");
                Field<NonNullGraphType<StringGraphType>>("CompanyName");
                Field<StringGraphType>("ContactName");
                Field<StringGraphType>("ContactTitle");
                Field<StringGraphType>("Address");
                Field<StringGraphType>("City");
                Field<StringGraphType>("Country");
                Field<StringGraphType>("Region");
                Field<StringGraphType>("Fax");
                Field<StringGraphType>("Phone");
        }
    }    
}