using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class OrderType : ObjectGraphType<Order>
    {
        public OrderType()
        {
            Field(x => x.OrderId,false);
            Field(x => x.CustomerId,true);
            Field(x => x.EmployeeId,true);            
            Field(x => x.OrderDate,true);
            Field(x => x.RequiredDate,true);
            Field(x => x.ShippedDate,true);
            Field(x => x.ShipVia,true);
            Field(x => x.Freight,true);
            Field(x => x.ShipName,true);
            Field(x => x.ShipAddress,true);
            Field(x => x.ShipCity,false);
            Field(x => x.ShipRegion,true);
            Field(x => x.ShipPostalCode,true);            
            Field(x => x.ShipCountry,true);
            Field(x => x.Customer,true, type: typeof(CustomerType)).Description("Customer");
            Field(x => x.Employee,true, type: typeof(EmployeeType)).Description("Employee");
            Field(x => x.OrderDetails,true, type: typeof(ListGraphType<OrderDetailType>)).Description("Order Details");
            Field(x => x.ShipViaNavigation,true, type: typeof(ShipperType)).Description("Shipper");
        }
    }

    public class OrderTypeInputType : InputObjectGraphType
    {
        public OrderTypeInputType()
        {
                Name = "OrderInput";
                Field<NonNullGraphType<IntGraphType>>("OrderId");
                Field<NonNullGraphType<IntGraphType>>("CustomerId");
                Field<NonNullGraphType<IntGraphType>>("OrderIdEmployeeId");
                Field<StringGraphType>("OrderDate");
                Field<StringGraphType>("RequiredDate");
                Field<StringGraphType>("ShippedDate");
                Field<StringGraphType>("ShipVia");
                Field<StringGraphType>("Freight");
                Field<StringGraphType>("ShipName");
                Field<StringGraphType>("ShipAddress");
                Field<StringGraphType>("ShipCity");
                Field<StringGraphType>("ShipRegion");
                Field<StringGraphType>("ShipPostalCode");
                Field<StringGraphType>("ShipCountry");                
        }
    }    
}