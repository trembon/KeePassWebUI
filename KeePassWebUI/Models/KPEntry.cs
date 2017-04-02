using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KeePassWebUI.Models
{
    public class KPEntry
    {
        public string ID { get; set; }

        public string GroupID { get; set; }

        public string Name { get; set; }

        public string Username { get; set; }

        public string Url { get; set; }

        public string Password { get; set; }
    }
}