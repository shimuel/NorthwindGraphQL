﻿using System;
using System.Collections.Generic;

namespace DBLayer.Entities
{
    public partial class Category
    {
        public Category()
        {
            Products = new HashSet<Product>();
        }

        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
        //public byte[] Picture { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
