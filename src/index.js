import ko from "knockout";

import { Router, Route } from "@profiscience/knockout-contrib-router";
import { componentPlugin } from "@profiscience/knockout-contrib-router-plugins-component";
import "regenerator-runtime/runtime";

//Attach to window to enable Knockout Context Debugger
window.ko = ko;
ko.options.deferUpdates = true;

Router.use(loadingMiddleware);
Route.usePlugin(componentPlugin);

ko.components.register("empty", {
  template: `<span>empty template</span>`
});

// let sharedRoutes = [
//   new Route("/", "empty"),
//   new Route(
//     "/baz",
//     {
//       component: () => ({
//         template: import("./components/foo-bar/foo-bar-inner-template.html"),
//         viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
//         synchronous: true
//       })
//     }
//   ),
//   new Route(
//     "/qux",
//     {
//       component: () => ({
//         template: import("./components/foo-bar/foo-bar-inner-template.html"),
//         viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
//         synchronous: true
//       })
//     }
//   )
// ];

Router.useRoutes([
  new Route("/", {
    component: () => ({
      template: import("./components/my-component/my-component-template.html"),
      viewModel: import("./components/my-component/my-component-viewmodel"),
      synchronous: true
    })
  }),
  new Route(
    "/bar",
    {
      component: () => ({
        template: import("./components/foo-bar/foo-bar-outer-template.html"),
        viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
        synchronous: true
      })
    },
    [
      new Route("/", "empty"),
      new Route("/baz", {
        component: () => ({
          template: import("./components/foo-bar/foo-bar-inner-template.html"),
          viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
          synchronous: true
        })
      }),
      new Route("/qux", {
        component: () => ({
          template: import("./components/foo-bar/foo-bar-inner-template.html"),
          viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
          synchronous: true
        })
      })
    ]
  ),
  new Route(
    "/foo",
    {
      component: () => ({
        template: import("./components/foo-bar/foo-bar-outer-template.html"),
        viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
        synchronous: true
      })
    },
    [
      new Route("/", "empty"),
      new Route("/baz", {
        component: () => ({
          template: import("./components/foo-bar/foo-bar-inner-template.html"),
          viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
          synchronous: true
        })
      }),
      new Route("/qux", {
        component: () => ({
          template: import("./components/foo-bar/foo-bar-inner-template.html"),
          viewModel: import("./components/foo-bar/foo-bar-viewmodel"),
          synchronous: true
        })
      })
    ]
  ),
  new Route(
    "/parent",
    {
      component: () => ({
        template: `<a data-bind="path: '//'">Go to root</a>
          <router></router>`
      })
    },
    [
      new Route("/", {
        component: () => ({
          template: `<a data-bind="path: '/bar'">Local</a>
          | <a data-bind="path: '//bar'">Absolute</a>
          | <a data-bind="path: '../bar'">Relative Parent</a>
          | <a data-bind="path: './childA'">Relative Child (the right one)</a>`
        })
      }),
      new Route("/childA", {
        component: () => ({
          template: "<h1>This is Child A</h1>"
        })
      })
    ]
  )
]);

function loadingMiddleware(ctx) {
  return {
    beforeRender(/* done */) {
      console.log("beforeRender");
      ctx.observablePathName = ko.observable(ctx.path);
    },
    afterRender() {
      console.log(
        "[router " + ctx.router.depth + "] navigated to:",
        ctx.pathname
      );
    },
    beforeDispose() {
      console.log("[router] navigating away from", ctx.pathname);
    },
    afterDispose() {
      console.log("[router] navigated away from", ctx.pathname);
    }
  };
}

ko.applyBindings({});
