'use client'

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface SlashCommandsOptions {
  onSlash: (query: string, range: { from: number; to: number }) => void
  trigger: string
}

export const SlashCommands = Extension.create<SlashCommandsOptions>({
  name: 'slashCommands',

  addOptions() {
    return {
      onSlash: () => {},
      trigger: '/',
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('slashCommands'),
        view: () => ({
          update: (view) => {
            const { state } = view
            const { doc, selection } = state
            const { from, to } = selection

            // Only trigger on single character selection
            if (from !== to) return

            const $from = doc.resolve(from)
            const textBefore = doc.textBetween(
              Math.max(0, $from.start()),
              from,
              undefined,
              '\ufffc'
            )

            const match = textBefore.match(new RegExp(`\\${this.options.trigger}$`))
            
            if (match) {
              const query = textBefore.slice(0, -this.options.trigger.length)
              this.options.onSlash(query, { from: from - this.options.trigger.length, to: from })
            }
          },
        }),
      }),
    ]
  },
}) 