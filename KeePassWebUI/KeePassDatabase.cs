using KeePassLib;
using KeePassLib.Keys;
using KeePassLib.Serialization;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace KeePassWebUI
{
    public class KeePassDatabase
    {
        private static PwGroup root = null;

        public static PwGroup Root
        {
            get
            {
                if (root == null)
                    ReadDatabase();

                return root;
            }
        }

        private static void ReadDatabase()
        {
            var ioConnInfo = new IOConnectionInfo { Path = ConfigurationManager.AppSettings["databasePath"] };
            var compKey = new CompositeKey();

            if(!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databasePassword"]))
                compKey.AddUserKey(new KcpPassword(ConfigurationManager.AppSettings["databasePassword"]));

            if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databaseKeyFile"]))
                compKey.AddUserKey(new KcpKeyFile(ConfigurationManager.AppSettings["databaseKeyFile"]));

            var db = new PwDatabase();
            db.Open(ioConnInfo, compKey, null);

            root = db.RootGroup.CloneDeep();
            
            db.Close();
        }
    }
}