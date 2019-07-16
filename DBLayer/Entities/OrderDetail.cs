using System;
using System.Collections.Generic;

namespace DBLayer.Entities
{
    public partial class OrderDetail
    {
        public long OrderId { get; set; }
        public long ProductId { get; set; }
        public string UnitPrice { get; set; }
        public long Quantity { get; set; }
        public double Discount { get; set; }

        public Order Order { get; set; }
        public Product Product { get; set; }
    }
}
