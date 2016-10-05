{

  class Code extends Jinkela {
    init() {
      if (typeof window.hljs !== 'undefined') window.hljs.highlightBlock(this.pre);
    }
    get styleSheet() {
      return `
        :scope {
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: relative;
          padding-bottom: 44px;
          box-sizing: border-box;
          max-height: 0px;
          transition: max-height 200ms;
          &.active {
            > button::before { content: '▲  Hide'; }
            max-height: 1000px;
          }
          > pre {
            margin: 0;
            background: #fafafa;
            border: solid #eaeefb;
            border-width: 1px 0 0 0;
            white-space: pre;
            font-family: Menlo, Monaco, Consolas, Courier, monospace;
            font-size: 12px;
            line-height: 1.8;
            padding: 18px 24px;
            -webkit-font-smoothing: auto;
          }
          > button {
            left: 0;
            right: 0;
            bottom: 0;
            position: absolute;
            border: 0;
            border-top: 1px solid #eaeefb;
            height: 44px;
            line-height: 44px;
            width: 100%;
            text-align: center;
            outline: 0;
            color: #d3dce6;
            cursor: pointer;
            font-size: 14px;
            background: #fff;
            -webkit-font-smoothing: antialiased;
            transition: color 200ms;
            &::before { content: '▼  Expand'; }
            max-height: 1000px;
            &:hover {
              color: #409eff;
            }
          }
        }
      `;
    }
    toggle() { this.element.classList.toggle('active'); }
    get template() {
      return `
        <div>
          <pre class="html" ref="pre">{code}</pre>
          <button type="button" on-click="{toggle}"></button>
        </div>
      `;
    }
  }

  class GroupPanel extends Jinkela {
    get Code() { return Code; }
    get template() {
      return `
        <dd>
          <p>
            <meta ref="children" />
          </p>
          <jkl-code code="{code}"></jkl-code>
        </dd>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          overflow: hidden;
          transition: box-shadow 200ms;
          border: 1px solid #ebebeb;
          border-radius: 3px;
          margin: 0;
          &:hover {
            box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
          }
          > p {
            margin: 24px;
            > * { margin-right: 20px; }
          }
        }
      `;
    }
  }

  class GroupTable extends Jinkela {
    get template() {
      return `
        <dd>
          <table>
            <tbody ref="children"></tbody>
          </table>
        </dd>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          margin: 0;
          > table {
            border-collapse: collapse;
            width: 100%;
            background-color: #fff;
            font-size: 14px;
            margin-bottom: 45px;
            line-height: 1.5em;
            th {
              text-align: left;
              white-space: nowrap;
              color: #666;
              font-weight: 400;
              border-bottom: 1px solid #d8d8d8;
              padding: 15px;
              max-width: 250px;
            }
            td {
              border-bottom: 1px solid #d8d8d8;
              color: #333;
              padding: 15px;
              max-width: 250px;
            }
          }
        }
      `;
    }
  }

  class Group extends Jinkela { // eslint-disable-line no-unused-vars
    get template() {
      return `
        <dl>
          <dt>{title}</dt>
          <meta ref="dd" />
        </dl>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          > dt {
            font-weight: 400;
            color: #1f2f3d;
            font-size: 22px;
            margin: 55px 0 20px;
          }
        }
      `;
    }
  }

  Jinkela.register({
    pattern: /^BODY$/,
    handler(that, body) {
      document.head.insertAdjacentHTML('beforeend', `
        <style>
          body {
            -webkit-font-smoothing: antialiased;
            font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
            margin: 0;
            padding: 55px;
            box-sizing: border-box;
          }
          body > h1 {
            font-weight: 400;
            color: #1f2f3d;
            font-size: 28px;
            margin: 0;
          }
        </style>
      `);
      let h1 = document.createElement('h1');
      h1.textContent = document.title;
      body.insertBefore(h1, body.firstChild);
    }
  });

  Jinkela.register({
    pattern: /^demo$/,
    handler(that, node, element) {
      let title = node.nodeValue;
      if (element.tagName === 'DIV') {
        let code = element.innerHTML;
        code = code.replace(/^ *\n|\n *$/, ''); // Remove blank lines on head or tail
        let indent = Math.min(...code.match(/^( *)(?=\S)/gm).map(s => s.length)); // Caculate the indent size
        code = code.split(/\n/g).map(s => s.slice(indent)).join('\n'); // Reduce the indent
        that['@@beforeInit'].push(() => {
          let dd = new GroupPanel({ children: Array.from(element.children), code });
          element['@@binding'] = new Group({ title, dd }).element;
        });
      } else if (element.tagName === 'TABLE') {
        that['@@beforeInit'].push(() => {
          let dd = new GroupTable({ children: Array.from(element.children) });
          element['@@binding'] = new Group({ title, dd }).element;
        });
      }
    }
  });

}
