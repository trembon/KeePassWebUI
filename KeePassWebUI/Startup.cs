using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(KeePassWebUI.Startup))]

namespace KeePassWebUI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}