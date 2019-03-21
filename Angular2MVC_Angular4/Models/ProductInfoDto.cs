using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Angular2MVC.Models
{
    public class ProductInfoDto
    {
        public int Id;
        public string MaterialCode { get; set; }
        public string Description { get; set; }
        public double? Price { get; set; }
        public int? Inventory { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string ImagePath { get; set; }


    }
}