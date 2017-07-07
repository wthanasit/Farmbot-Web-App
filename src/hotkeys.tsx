import * as React from "react";
import * as _ from "lodash";
import {
  Hotkey,
  Hotkeys,
  HotkeysTarget,
  IHotkeyProps
} from "@blueprintjs/core";

import { links } from "./nav/links";
import { sync } from "./devices/actions";
import { lastUrlChunk } from "./util";
import { history, push } from "./history";

interface Props {
  dispatch: Function;
}

@HotkeysTarget
export class HotKeys extends React.Component<Props, {}> {
  render() {
    return <span />;
  }

  hotkeys(dispatch: Function, slug: string) {
    let idx = _.findIndex(links, { slug });
    let right = "/app/" + (links[idx + 1] || links[0]).slug;
    let left = "/app/" + (links[idx - 1] || links[links.length - 1]).slug;
    let HOTKEY_MAP: IHotkeyProps[] = [
      {
        combo: "ctrl + shift + s",
        label: "Sync",
        onKeyDown: () => dispatch(sync())
      },
      {
        combo: "ctrl + shift + right",
        label: "Navigate right",
        onKeyDown: () => push(right)
      },
      {
        combo: "ctrl + shift + left",
        label: "Navigate left",
        onKeyDown: () => push(left)
      },
    ];
    return HOTKEY_MAP;
  }

  renderHotkeys() {
    let slug = history.getCurrentLocation().pathname.split("/")[2];
    return <Hotkeys>
      {
        this.hotkeys(this.props.dispatch, slug)
          .map(({ combo, label, onKeyDown }: IHotkeyProps, index: number) => {
            return <Hotkey
              key={index}
              global={true}
              combo={combo}
              label={label}
              onKeyDown={onKeyDown}
            />;
          })
      }
    </Hotkeys>;
  }
}
