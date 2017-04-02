using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KeePassWebUI.Models
{
    public class KPGroup
    {
        public string ID { get; set; }

        public string ParentID { get; set; }

        public string Name { get; set; }
    }
}