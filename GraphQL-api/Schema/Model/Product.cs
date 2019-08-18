using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class ProductType : ObjectGraphType<Product>
    {
        public ProductType()
        {
            Field(x => x.ProductId,false);
            Field(x => x.SupplierId,true);
            Field(x => x.CategoryId,true);            
            Field(x => x.ProductName,false);
            Field(x => x.QuantityPerUnit,true);
            Field(x => x.UnitPrice,true);
            Field(x => x.UnitsInStock,true);
            Field(x => x.UnitsOnOrder,true);
            Field(x => x.ReorderLevel,true);
            Field(x => x.Discontinued,true);            
            Field(x => x.Category, false, type: typeof(CategoryType)).Description("Category");
            Field(x => x.Supplier,true, type: typeof(SupplierType)).Description("Supplier");
            Field(x => x.OrderDetails,true, type: typeof(ListGraphType<OrderDetailType>)).Description("OrderDetails");
        }
    }

    public class ProductTypeInputType : InputObjectGraphType
    {
        public ProductTypeInputType()
        {
                Name = "ProductInput";
                Field<NonNullGraphType<IntGraphType>>("ProductId");
                Field<IntGraphType>("SupplierId");
                Field<IntGraphType>("CategoryId");
                Field<StringGraphType>("ProductName");
                Field<StringGraphType>("QuantityPerUnit");
                Field<StringGraphType>("UnitPrice");
                Field<StringGraphType>("UnitsInStock");
                Field<StringGraphType>("UnitsOnOrder");
                Field<StringGraphType>("ReorderLevel");
                Field<StringGraphType>("Discontinued");
        }
    }    
}