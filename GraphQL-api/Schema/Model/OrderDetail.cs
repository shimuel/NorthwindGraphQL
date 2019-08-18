using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class OrderDetailType : ObjectGraphType<OrderDetail>
    {
        public OrderDetailType()
        {           
            Field(x => x.OrderId,false);
            Field(x => x.ProductId,false);            
            Field(x => x.UnitPrice,true);
            Field(x => x.Quantity,true);
            Field(x => x.Discount,true);
            Field(x => x.Order,true, type: typeof(OrderType)).Description("Order");
            Field(x => x.Product,true, type: typeof(ProductType)).Description("Product");           
        }
    }

    public class OrderDetailTypeInputType : InputObjectGraphType
    {
        public OrderDetailTypeInputType()
        {
                Name = "OrderDetailInput";
                Field<NonNullGraphType<IntGraphType>>("OrderId");
                Field<NonNullGraphType<IntGraphType>>("ProductId");
                Field<StringGraphType>("UnitPrice");
                Field<StringGraphType>("Quantity");
                Field<StringGraphType>("Discount");
        }
    }    
}