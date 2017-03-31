using KeePassLib;
using KeePassLib.Keys;
using KeePassLib.Serialization;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace KeePassWebUI.DAL
{
    public class KeePassContext : IDisposable
    {
        private bool opened = false;
        private PwDatabase database;

        private static PwGroup cache_group;

        public PwDatabase Database
        {
            get
            {
                if (!opened)
                    throw new InvalidOperationException();

                return database;
            }
        }

        public KeePassContext()
        {
        }

        private PwDatabase Open()
        {
            if (opened)
                return database;

            opened = true;

            var ioConnInfo = new IOConnectionInfo { Path = ConfigurationManager.AppSettings["databasePath"] };
            var compKey = new CompositeKey();

            if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databasePassword"]))
                compKey.AddUserKey(new KcpPassword(ConfigurationManager.AppSettings["databasePassword"]));

            if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databaseKeyFile"]))
                compKey.AddUserKey(new KcpKeyFile(ConfigurationManager.AppSettings["databaseKeyFile"]));

            database = new PwDatabase();
            database.Open(ioConnInfo, compKey, null);

            return database;
        }

        public void Dispose()
        {
            if(database != null)
            {
                database.Close();
            }
        }

        public PwGroup GetRoot()
        {
            if (cache_group == null)
            {
                PwDatabase db = this.Open();
                cache_group = db.RootGroup.CloneDeep();
            }

            return cache_group;
        }


        //private static PwGroup root = null;

        //public static PwGroup Root
        //{
        //    get
        //    {
        //        if (root == null)
        //            ReadDatabase();

        //        return root;
        //    }
        //}

        //private static void ReadDatabase()
        //{
        //    var ioConnInfo = new IOConnectionInfo { Path = ConfigurationManager.AppSettings["databasePath"] };
        //    var compKey = new CompositeKey();

        //    if(!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databasePassword"]))
        //        compKey.AddUserKey(new KcpPassword(ConfigurationManager.AppSettings["databasePassword"]));

        //    if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databaseKeyFile"]))
        //        compKey.AddUserKey(new KcpKeyFile(ConfigurationManager.AppSettings["databaseKeyFile"]));

        //    var db = new PwDatabase();
        //    db.Open(ioConnInfo, compKey, null);

        //    root = db.RootGroup.CloneDeep();
            
        //    db.Close();
        //}
    }
}