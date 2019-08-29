using Microsoft.EntityFrameworkCore;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using GraphQL_api.Schema.Model;

namespace GraphQL_api.Schema
{
    public class NorthwindQuery : ObjectGraphType
    {
        public NorthwindQuery(IUnitOfWork uow)
        {
            //Category
            Field<CategoryType>(
                "Category",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<int>("id");
                     var tmp = uow.GetRepositoryAsync<Category>().SingleAsync(predicate: i=> i.CategoryId == id,
                        include: q => q.Include(j => j.Products)
                     );   
                     //var tmp = uow.GetRepositoryAsync<Category>().SingleAsync(predicate: i=> i.CategoryId == id);                     
                    return tmp;
            });

            Field<ListGraphType<CategoryType>>(
                "Categories",
                resolve: context => {
                     // var tmp = uow.GetRepositoryAsync<Category>().GetListAsync(
                     //    include: q => q.Include(j => j.Products)
                     // );                     
                     var tmp = uow.GetRepositoryAsync<Category>().GetListAsync();                     
                    return tmp.Result.Items;
            });

            //Customer
            Field<CustomerType>(
                "customer",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<StringGraphType>>{ Name = "id" }),
                resolve: context =>
                {         
                    var id = context.GetArgument<string>("id");
                    return uow.GetRepositoryAsync<Customer>().SingleAsync(predicate: i=> i.CustomerId == id,
                     include: q => q.Include(j => j.CustomerCustomerDemo).ThenInclude(k=>k.CustomerType));
                }
            );

            Field<ListGraphType<CustomerType>>(
                "customers",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Customer>().GetListAsync(
                        include: q => q.Include(j => j.CustomerCustomerDemo).ThenInclude(k=>k.CustomerType));                     
                    return tmp.Result.Items;
            });

            //CustomerDemographic
            Field<CustomerDemographicType>(
                "CustomerDemographic",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<StringGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<CustomerDemographic>().SingleAsync(predicate: i=> i.CustomerTypeId == id,
                        include: q => q.Include(j => j.CustomerCustomerDemo)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<CustomerDemographicType>>(
                "CustomerDemographics",
                resolve: context => {
                    //  var userContext = context.UserContext as MyGraphQLUserContext;
                     var tmp = uow.GetRepositoryAsync<CustomerDemographic>().GetListAsync(
                        include: q => q.Include(j => j.CustomerCustomerDemo)
                     );                     
                     return tmp.Result.Items;
             });

            //CustomerCustomerDemo
            Field<CustomerCustomerDemoType>(
                "CustomerCustomerDemo",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<StringGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<CustomerCustomerDemo>().SingleAsync(predicate: i=> i.CustomerTypeId == id,
                        include: q => q.Include(j => j.Customer).Include(k=>k.Customer)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<CustomerCustomerDemoType>>(
                "CustomerCustomerDemos",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<CustomerCustomerDemo>().GetListAsync(
                        include: q => q.Include(j => j.Customer).Include(k=>k.Customer).Include(k=>k.CustomerType)
                     );                     
                    return tmp.Result.Items;
            });

            
            //Employee
            Field<EmployeeType>(
                "Employee",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<Employee>().SingleAsync(predicate: i=> i.EmployeeId.ToString() == id,
                        include: q => q.Include(o=>o.Orders).Include(j => j.InverseEmployee).Include(k=>k.Region).Include(l=>l.EmployeeTerritories)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<EmployeeType>>(
                "Employees",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Employee>().GetListAsync(
                        include: q => q.Include(o=>o.Orders).Include(j => j.InverseEmployee).Include(k=>k.Region).Include(l=>l.EmployeeTerritories)
                     );                     
                    return tmp.Result.Items;
            });   

            //Employee
            Field<EmployeeTerritoryType>(
                "EmployeeTerritories",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<EmployeeTerritory>().SingleAsync(predicate: i=> i.EmployeeId.ToString() == id,
                        include: q => q.Include(j => j.Employee).Include(k=>k.Territory)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<EmployeeTerritoryType>>(
                "EmployeesTerritories",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<EmployeeTerritory>().GetListAsync(
                        include: q => q.Include(o=>o.Employee).Include(j => j.Territory)
                     );                     
                    return tmp.Result.Items;
            });       

            //Order
            Field<OrderType>(
                "Order",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<Order>().SingleAsync(predicate: i=> i.OrderId.ToString() == id,
                        include: q => q.Include(j => j.Employee).Include(k=>k.OrderDetails).Include(k=>k.Customer).Include(k=>k.ShipViaNavigation)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<OrderType>>(
                "Orders",
                arguments:  new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "index" },
                            new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "size" }),
                resolve: context => {
                    var index = context.GetArgument<int>("index"); 
                    var size = context.GetArgument<int>("size"); 

                     System.Threading.Tasks.Task<IPaginate<Order>> tmp = null;
                     if(index == 0 || size == 0){
                        tmp = uow.GetRepositoryAsync<Order>().GetListAsync(
                            include: q => q.Include(j => j.Employee)
                            .Include(k=>k.OrderDetails).ThenInclude(p=>p.Product).ThenInclude(p=>p.Category)                         
                            .Include(k=>k.Customer).Include(k=>k.ShipViaNavigation)
                        );                     
                     }else{
                         tmp = uow.GetRepositoryAsync<Order>().GetListAsync(
                            index : index, size:size,
                            include: q => q.Include(j => j.Employee)
                            .Include(k=>k.OrderDetails).ThenInclude(p=>p.Product).ThenInclude(p=>p.Category)                         
                            .Include(k=>k.Customer).Include(k=>k.ShipViaNavigation)
                        );                     
                     }
                    return tmp.Result.Items;
            }); 

            //OrderDetails
            Field<OrderType>(
                "OrderDetail",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<OrderDetail>().SingleAsync(predicate: i=> i.OrderId.ToString() == id,
                        include: q => q.Include(j => j.Order).Include(k=>k.Product)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<OrderType>>(
                "OrderDetails",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<OrderDetail>().GetListAsync(
                        include: q => q.Include(j => j.Order).Include(k=>k.Product)
                     );                     
                    return tmp.Result.Items;
            }); 
            

            //Product
            Field<ProductType>(
                "Product",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<Product>().SingleAsync(predicate: i=> i.ProductId.ToString() == id,
                        include: q => q.Include(j => j.Category).Include(k=>k.Supplier).Include(k => k.OrderDetails)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<ProductType>>(
                "Products",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Product>().GetListAsync(
                        include: q => q.Include(j => j.Category).Include(k=>k.Supplier).Include(k => k.OrderDetails)
                     );                     
                    return tmp.Result.Items;
            });
             
            
            //Region
            Field<RegionType>(
                "Region",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<Region>().SingleAsync(predicate: i=> i.RegionId.ToString() == id,
                        include: q => q.Include(j => j.Territories)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<RegionType>>(
                "Regions",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Region>().GetListAsync(
                        include: q => q.Include(j => j.Territories)
                     );                     
                    return tmp.Result.Items;
            });

            //Shipper
            Field<ShipperType>(
                "Shipper",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<Shipper>().SingleAsync(predicate: i=> i.ShipperId.ToString() == id,
                        include: q => q.Include(j => j.Orders)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<ShipperType>>(
                "Shippers",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Shipper>().GetListAsync(
                        include: q => q.Include(j => j.Orders)
                     );                     
                    return tmp.Result.Items;
            });

            //Supplier
            Field<SupplierType>(
                "Supplier",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<Supplier>().SingleAsync(predicate: i=> i.SupplierId.ToString() == id,
                        include: q => q.Include(j => j.Products)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<ShipperType>>(
                "Suppliers",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Supplier>().GetListAsync(
                        include: q => q.Include(j => j.Products)
                     );                     
                    return tmp.Result.Items;
            });   

            //Territory
            Field<TerritoryType>(
                "Territory",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" }),
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<Territory>().SingleAsync(predicate: i=> i.TerritoryId.ToString() == id,
                        include: q => q.Include(j => j.EmployeeTerritories).Include(j => j.Region)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<TerritoryType>>(
                "Territories",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Territory>().GetListAsync(
                        include: q => q.Include(j => j.EmployeeTerritories).Include(j => j.Region)
                     );                     
                    return tmp.Result.Items;
            });               
        }            
    }
}
