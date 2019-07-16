using System;
using System.Collections.Generic;

namespace DBLayer.Entities
{
    public partial class EmployeeTerritory
    {
        public long EmployeeId { get; set; }
        public string TerritoryId { get; set; }

        public Employee Employee { get; set; }
        public Territory Territory { get; set; }
    }
}
