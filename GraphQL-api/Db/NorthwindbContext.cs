using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using GraphQL_api.Models;

namespace GraphQL_api.Db
{
    public partial class NorthwindbContext : DbContext
    {
        public NorthwindbContext()
        {
        }

        public NorthwindbContext(DbContextOptions<NorthwindbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CustomerCustomerDemo> CustomerCustomerDemo { get; set; }
        public virtual DbSet<CustomerDemographic> CustomerDemographics { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmployeeTerritory> EmployeeTerritories { get; set; }
        public virtual DbSet<OrderDetail> OrderDetails { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Region> Regions { get; set; }
        public virtual DbSet<Shipper> Shippers { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<Territory> Territories { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
//             if (!optionsBuilder.IsConfigured)
//             {
// // #warning To protect potentially sensitive information in your connection string, you should move it out of source code. 
// // #warning See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                 optionsBuilder.UseSqlite("Filename=./Northwind.db");
//             }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.CategoryId);

                entity.Property(e => e.CategoryId)
                    .HasColumnName("CategoryID")
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<CustomerCustomerDemo>(entity =>
            {
                entity.HasKey(e => new { e.CustomerId, e.CustomerTypeId });

                entity.Property(e => e.CustomerId).HasColumnName("CustomerID");

                entity.Property(e => e.CustomerTypeId).HasColumnName("CustomerTypeID");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.CustomerCustomerDemo)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.CustomerType)
                    .WithMany(p => p.CustomerCustomerDemo)
                    .HasForeignKey(d => d.CustomerTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomerDemographic>(entity =>
            {
                entity.HasKey(e => e.CustomerTypeId);

                entity.Property(e => e.CustomerTypeId)
                    .HasColumnName("CustomerTypeID")
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.CustomerId);

                entity.Property(e => e.CustomerId)
                    .HasColumnName("CustomerID")
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.EmployeeId);

                entity.Property(e => e.EmployeeId)
                    .HasColumnName("EmployeeID")
                    .ValueGeneratedNever();

                entity.Property(e => e.BirthDate).HasColumnType("DATE");

                entity.Property(e => e.HireDate).HasColumnType("DATE");

                entity.HasOne(d => d.Employee1)
                    .WithOne(p => p.InverseEmployee)
                    .HasForeignKey<Employee>(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<EmployeeTerritory>(entity =>
            {
                entity.HasKey(e => new { e.EmployeeId, e.TerritoryId });

                entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

                entity.Property(e => e.TerritoryId).HasColumnName("TerritoryID");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.EmployeeTerritories)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Territory)
                    .WithMany(p => p.EmployeeTerritories)
                    .HasForeignKey(d => d.TerritoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasKey(e => new { e.OrderId, e.ProductId });

                entity.ToTable("Order Details");

                entity.Property(e => e.OrderId).HasColumnName("OrderID");

                entity.Property(e => e.ProductId).HasColumnName("ProductID");

                entity.Property(e => e.Quantity).HasDefaultValueSql("1");

                entity.Property(e => e.UnitPrice)
                    .IsRequired()
                    .HasColumnType("NUMERIC")
                    .HasDefaultValueSql("0");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrderDetails)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.OrderDetails)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.OrderId);

                entity.Property(e => e.OrderId)
                    .HasColumnName("OrderID")
                    .ValueGeneratedNever();

                entity.Property(e => e.CustomerId).HasColumnName("CustomerID");

                entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

                entity.Property(e => e.Freight)
                    .HasColumnType("NUMERIC")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.OrderDate).HasColumnType("DATETIME");

                entity.Property(e => e.RequiredDate).HasColumnType("DATETIME");

                entity.Property(e => e.ShippedDate).HasColumnType("DATETIME");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.CustomerId);

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.EmployeeId);

                entity.HasOne(d => d.ShipViaNavigation)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.ShipVia);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.ProductId);

                entity.Property(e => e.ProductId)
                    .HasColumnName("ProductID")
                    .ValueGeneratedNever();

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.Discontinued)
                    .IsRequired()
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.ProductName).IsRequired();

                entity.Property(e => e.ReorderLevel).HasDefaultValueSql("0");

                entity.Property(e => e.SupplierId).HasColumnName("SupplierID");

                entity.Property(e => e.UnitPrice)
                    .HasColumnType("NUMERIC")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.UnitsInStock).HasDefaultValueSql("0");

                entity.Property(e => e.UnitsOnOrder).HasDefaultValueSql("0");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId);

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.SupplierId);
            });

            modelBuilder.Entity<Region>(entity =>
            {
                entity.HasKey(e => e.RegionId);

                entity.Property(e => e.RegionId)
                    .HasColumnName("RegionID")
                    .ValueGeneratedNever();

                entity.Property(e => e.RegionDescription).IsRequired();
            });

            modelBuilder.Entity<Shipper>(entity =>
            {
                entity.HasKey(e => e.ShipperId);

                entity.Property(e => e.ShipperId)
                    .HasColumnName("ShipperID")
                    .ValueGeneratedNever();

                entity.Property(e => e.CompanyName).IsRequired();
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.HasKey(e => e.SupplierId);

                entity.Property(e => e.SupplierId)
                    .HasColumnName("SupplierID")
                    .ValueGeneratedNever();

                entity.Property(e => e.CompanyName).IsRequired();
            });

            modelBuilder.Entity<Territory>(entity =>
            {
                entity.HasKey(e => e.TerritoryId);

                entity.Property(e => e.TerritoryId)
                    .HasColumnName("TerritoryID")
                    .ValueGeneratedNever();

                entity.Property(e => e.RegionId).HasColumnName("RegionID");

                entity.Property(e => e.TerritoryDescription).IsRequired();

                entity.HasOne(d => d.Region)
                    .WithMany(p => p.Territories)
                    .HasForeignKey(d => d.RegionId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });
        }
    }
}
