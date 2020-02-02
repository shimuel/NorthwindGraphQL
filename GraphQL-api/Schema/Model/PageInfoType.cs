using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class PageInfo<T>
    {
        public int TotalCount { get; private set; }
        public int PageIndex { get; private set; }        
        public int Size { get; private set; }
        public int PageCount { get; private set; }
        public IEnumerable<T> List { get; private set; }
        //public IEnumerable<string> Chars { get; set; }
        //private IEnumerable<T> OriginalList { get; set; }
        // public PageInfo(IEnumerable<T> list, int page, int size)
        // {
        //     //OriginalList = list;//for a-z filters
        //     List = list.Skip((page - 1)  * size).Take(size);
        //     TotalCount = list.Count();
        //     PageCount = Convert.ToInt32(Math.Ceiling(TotalCount / Convert.ToDouble(size)));
        //     Size = size;
        // }

        public PageInfo(IEnumerable<T> list, int page, int totalCount, int size)
        {
            //OriginalList = list;//for a-z filters
            List = list;
            PageIndex = page;
            TotalCount = totalCount;
            PageCount = Convert.ToInt32(Math.Ceiling(TotalCount / Convert.ToDouble(size)));
            Size = size;
        }
    }

    public class PageInfoType : ObjectGraphType<PageInfo<Order>>  //where T : GraphType
    {
        public PageInfoType()
        {
            Field<ListGraphType<OrderType>>(
                "Items",
                resolve: context => {
                    return context.Source.List;
                }
            );
            //Field(xx => xx.Chars);
            Field(xx => xx.PageCount);
            Field(xx => xx.Size);
            Field(xx => xx.TotalCount);
        }
    }
}