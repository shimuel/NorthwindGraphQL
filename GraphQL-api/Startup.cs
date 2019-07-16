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
using GraphQL;
using GraphQL.Types;
using DBLayer;
using DBLayer.DI;
using DBLayer.Entities;
using GraphQL_api.Schema;
using AutoMapper;
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
            services.AddMvc();//.SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddAutoMapper();

             services.AddDbContext<NorthwindbContext>(options =>
                   options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"))).AddUnitOfWork<NorthwindbContext>();

            // services.AddDbContext<NorthwindbContext>(options => options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            // services.AddTransient<OrderRepo>();
            // services.AddTransient<CustomerRepo>();
            services.AddSingleton<IDocumentExecuter, DocumentExecuter>();
            services.AddSingleton<GraphQL_api.Schema.CustomerType>();
            //services.AddSingleton<GraphQL_api.Schema.CustomerInputType>();
            services.AddSingleton<NorthwindQuery>();
            services.AddSingleton<NorthwindMutation>();
            services.AddSingleton<GraphQL_api.Schema.CustomerType>();
            services.AddSingleton<GraphQL_api.Schema.CustomerInputType>();
            services.AddSingleton<GraphQL_api.Schema.CustomerCustomerDemoType>();
            // services.AddSingleton<GraphQL_api.Schema.CustomerCustomerDemoInputType>();
            services.AddSingleton<GraphQL_api.Schema.CustomerDemographicType>();
            // services.AddSingleton<GraphQL_api.Schema.CustomerDemographicInputType>();
            var sp = services.BuildServiceProvider();
            services.AddSingleton<ISchema>(new NorthwindSchema(new FuncDependencyResolver(type => sp.GetService(type))));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            /* else
            {
                app.UseHsts();
            } */

            //app.UseHttpsRedirection();Only for MVC
            app.UseGraphiQl();
            app.UseMvc();
        }
    }
}
