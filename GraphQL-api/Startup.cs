using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;

using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

using GraphQL;
// using GraphiQl;

using GraphQL.Types;

using GraphQL.Http;
using GraphQL.Server;
using GraphQL.Server.Transports.AspNetCore;
using GraphQL.Server.Ui.Playground;
using GraphQL.Server.Ui;
using GraphQL.Server.Ui.GraphiQL;
using GraphQL.Server.Ui.Voyager;
using Microsoft.AspNetCore.Http;


using DBLayer;
using DBLayer.Impl;

using GraphQL_api.DI;
using DBLayer.Entities;
using GraphQL_api.Schema;

using GraphQL_api.Schema.Model;
using AutoMapper;

using GraphQL_api.Mappings;
using GraphQL_api.Auth;
using GraphQL_api.Auth.Services;

namespace GraphQL_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            //Scaffold-DbContext "Server=(localdb)\mssqllocaldb;Database=Blogging;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models
            //dotnet ef dbcontext scaffold "Filename=Northwind.db" Microsoft.EntityFrameworkCore.Sqlite -o Models -f -c NorthwindbContext  (the Northwind.db should exist in same folder)
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            var configuration = new MapperConfiguration(cfg => 
            {
                cfg.AddProfile<MappingProfile>();
            });
            // only during development, validate your mappings; remove it before release
            // configuration.AssertConfigurationIsValid();
            // use DI (http://docs.automapper.org/en/latest/Dependency-injection.html) or create the mapper yourself
            var mapper = configuration.CreateMapper();
            services.AddSingleton(mapper);
            
            // services.AddCors(options =>
            // {
            //     options.AddPolicy("AllowSpecificOrigin",
            //         builder => builder.WithOrigins("http://localhost:3000","http://localhost:8080")
            //         .AllowAnyMethod()
            //         .AllowAnyHeader()
            //         .AllowCredentials() 
            //     );
            // });
            
            //Begining of User
            services.AddDbContext<UserDBContext>(
                opt => opt.UseInMemoryDatabase("GraphqlUsers")
            ).AddUnitOfWork<UserDBContext>();   

            //configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            // services.AddAuthentication(x =>
            // {
            //     x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //     x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            // })
            // .AddJwtBearer(x =>
            // {
            //     x.Events = new JwtBearerEvents
            //     {
            //         OnTokenValidated = context =>
            //         {
            //             var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
            //             var userId = int.Parse(context.Principal.Identity.Name);
            //             // Console.Write("USER ID ????????????????????????????????????????????????????????"+userId);
            //             var user = userService.GetById(userId);
            //             if (user == null)
            //             {
            //                 // Console.Write("No User ????????????????????????????????????????????????????????");
            //                 // return unauthorized if user no longer exists
            //                 context.Fail("Unauthorized");
            //             }
            //             return Task.CompletedTask;
            //         }
            //     };
            //     x.RequireHttpsMetadata = false;
            //     x.SaveToken = true;
            //     x.TokenValidationParameters = new TokenValidationParameters
            //     {
            //         ValidateIssuerSigningKey = true,
            //         IssuerSigningKey = new SymmetricSecurityKey(key),
            //         ValidateIssuer = false,
            //         ValidateAudience = false
            //     };
            // });

            // configure DI for application services
            services.AddScoped<IUserService, UserService>();
            //End of User
        
            //Graphiql
            services.AddDbContext<NorthwindbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"))
                ).AddUnitOfWork<NorthwindbContext>();                        
            
            services.AddScoped<IDependencyResolver>(s => new FuncDependencyResolver(s.GetRequiredService));

            services.AddScoped<IDocumentExecuter, DocumentExecuter>();
            services.AddScoped<IDocumentWriter, DocumentWriter>();
            
            services.AddScoped<CategoryType>();
            services.AddScoped<CategoryTypeInputType>();

            services.AddScoped<CustomerType>();
            services.AddScoped<CustomerInputType>();
            
            services.AddScoped<CustomerCustomerDemoType>();
            services.AddScoped<CustomerCustomerDemoTypeInputType>();

            services.AddScoped<CustomerDemographicType>();
            services.AddScoped<CustomerDemographicTypeInputType>();

            services.AddScoped<EmployeeType>();
            services.AddScoped<EmployeeTypeInputType>();

            services.AddScoped<EmployeeTerritoryType>();
            services.AddScoped<EmployeeTerritoryTypeInputType>();

            services.AddScoped<OrderType>();
            services.AddScoped<OrderTypeInputType>();

            services.AddScoped<OrderDetailType>();
            services.AddScoped<OrderDetailTypeInputType>();

            services.AddScoped<ProductType>();
            services.AddScoped<ProductTypeInputType>();

            services.AddScoped<RegionType>();
            services.AddScoped<RegionTypeInputType>();

            services.AddScoped<ShipperType>();
            services.AddScoped<ShipperTypeInputType>();

            services.AddScoped<SupplierType>();
            services.AddScoped<SupplierTypeInputType>();

            services.AddScoped<TerritoryType>();
            services.AddScoped<TerritoryTypeInputType>();

            //  var sp = services.BuildServiceProvider();
            //  services.AddScoped<ISchema>(new NorthwindSchema(new FuncDependencyResolver(type => sp.GetService(type))));

            // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // services.AddScoped<IDependencyResolver>(s => new FuncDependencyResolver(s.GetRequiredService));
            
            services.AddScoped<DbContext, NorthwindbContext>();
            services.AddScoped<DbContext, UserDBContext>();
            services.AddScoped<IRepositoryFactory, UnitOfWork<DbContext>>();
            services.AddScoped<IUnitOfWork, UnitOfWork<DbContext>>();
            services.AddScoped<IUnitOfWork<DbContext>, UnitOfWork<DbContext>>();

            services.AddScoped<NorthwindSchema>();
            services.AddScoped<NorthwindQuery>();
            services.AddScoped<NorthwindMutation>();         
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddGraphQL(options =>
            {
                options.EnableMetrics = true;
                //options.ExposeExceptions = Environment.IsDevelopment();
            })
            .AddWebSockets()
            .AddDataLoader()
            .AddUserContextBuilder(httpContext => new GraphQL_api.Schema.GraphQLUserContext { User = httpContext.User });
            services.AddMvc();
            
        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            // app.UseAuthentication();
            // app.UseCors("AllowSpecificOrigin");

             app.UseWebSockets();
            app.UseGraphQLWebSockets<NorthwindSchema>("/graphql");
            app.UseGraphQL<NorthwindSchema>("/graphql");
            app.UseGraphQLPlayground(new GraphQLPlaygroundOptions
            {
                Path = "/ui/playground"
                // PlaygroundSettings = new Dictionary<string, object>
                // {
                //     ["editor.theme"] = "light",
                //     ["tracing.hideTracingResponse"] = false
                // }
            });
            app.UseGraphiQLServer(new GraphiQLOptions
            {
                GraphiQLPath = "/ui/graphiql",
                GraphQLEndPoint = "/graphql"
            });
            app.UseGraphQLVoyager(new GraphQLVoyagerOptions
            {
                GraphQLEndPoint = "/graphql",
                Path = "/ui/voyager"
            });
            app.UseMvc();
        }
    }
}
