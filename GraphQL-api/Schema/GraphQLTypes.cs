using GraphQL.Types;
using GraphQL_api.Db;
using GraphQL_api.Models;

namespace GraphQL_api.Schema
{
    public class CustomerType : ObjectGraphType<Customer>
    {
        public CustomerType(/*CustomerRepo CustomerRepo*/)
        {
            Field(x => x.CustomerId);
            Field(x => x.CompanyName,true);
            Field(x => x.ContactName);            
            Field(x => x.ContactTitle);
            Field(x => x.Address);
            Field(x => x.City);
            Field(x => x.Country);
            Field(x => x.Region);
            Field(x => x.Fax);
            Field(x => x.Phone);

            //Field<StringGraphType>("birthDate", resolve: context => context.Source.BirthDate.ToShortDateString());
            // Field<ListGraphType<SkaterStatisticType>>("skaterSeasonStats",
            //     arguments: new QueryArguments(new QueryArgument<IntGraphType> { Name = "id" }),
            //     resolve: context => skaterStatisticRepository.Get(context.Source.Id), description: "Player's skater stats");
        }
    }


    public class CustomerInputType : InputObjectGraphType
    {
        public CustomerInputType()
        {
            Name = "CustomerInput";
            Field<NonNullGraphType<StringGraphType>>("CompanyName");
            Field<StringGraphType>("ContactName");
            Field<StringGraphType>("ContactTitle");
            Field<StringGraphType>("Address");
            Field<StringGraphType>("City");
            Field<StringGraphType>("Country");
            Field<StringGraphType>("Region");
            Field<StringGraphType>("Fax");
            Field<StringGraphType>("Phone");
            //Field<DateGraphType>("Phone");
        }
    }

    // public class EmployeeType : ObjectGraphType<Employee>
    // {
    //     public EmployeeType(EmployeeRepo EmpRepo)
    //     {
    //         Field(x => x.EmployeeId);            
    //         Field(x => x.Title);            
    //         Field(x => x.FirstName);
    //         Field(x => x.LastName);
    //         Field(x => x.Title);
    //         Field(x => x.TitleOfCourtesy);
    //         Field(x => x.ReportsTo);
    //         Field(x => x.Address);
    //         Field(x => x.City);
    //         Field(x => x.Country);
    //     }
    // }

    // public class OrderType : ObjectGraphType<Order>
    // {
    //     public OrderType(OrderRepo EmpRepo)
    //     {
    //         Field(x => x.OrderId);            
    //         Field(x => x.OrderDate);            
    //         Field(x => x.RequiredDate);
    //         Field(x => x.ShipAddress);
    //         Field(x => x.ShipCity);
    //         Field(x => x.ShipCountry);
    //         Field(x => x.ShipName);
    //         Field(x => x.ShippedDate);
    //         Field(x => x.ShipPostalCode);
    //         Field(x => x.ShipRegion);
    //         Field(x => x.ShipVia);
    //         Field(x => x.Freight);
    //     }
    // }
}