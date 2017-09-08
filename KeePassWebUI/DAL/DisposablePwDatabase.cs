using KeePassLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KeePassWebUI.DAL
{
    public class DisposablePwDatabase : IDisposable
    {
        public PwDatabase Database { get; }

        public DisposablePwDatabase(PwDatabase database)
        {
            this.Database = database;
        }

        public void Dispose()
        {
            if(Database != null)
                Database.Close();
        }
    }
}