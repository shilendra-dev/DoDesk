'use client'

import React, { useState } from 'react'
import { RichTextEditor } from './RichTextEditor'
import { Button } from '@/components/ui/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/molecules/card'

export function RichTextEditorDemo() {
  const [content, setContent] = useState('<h1>Welcome to the Rich Text Editor!</h1><p>This is a <strong>powerful</strong> editor with:</p><ul><li>Bubble menu formatting</li><li>Slash commands (type <code>/</code> to see)</li><li>Tables, lists, and more</li></ul>')
  const [readOnlyContent] = useState('<h2>Read-only Mode</h2><p>This content cannot be edited.</p>')

  const handleUpdate = (newContent: string) => {
    setContent(newContent)
  }

  const clearContent = () => {
    setContent('')
  }

  const addSampleContent = () => {
    setContent(`
      <h1>Sample Content</h1>
      <p>This is a <strong>sample</strong> with various formatting options:</p>
      <ul>
        <li><strong>Bold text</strong></li>
        <li><em>Italic text</em></li>
        <li><code>Inline code</code></li>
      </ul>
      <blockquote>
        This is a blockquote with some important information.
      </blockquote>
      <p>You can also create:</p>
      <ul data-type="taskList">
        <li><label><input type="checkbox" checked=""><div>Task lists</div></label></li>
        <li><label><input type="checkbox"><div>Tables</div></label></li>
        <li><label><input type="checkbox"><div>Links</div></label></li>
      </ul>
    `)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Rich Text Editor Demo</h1>
        <p className="text-muted-foreground">
          A modern, feature-rich editor built with Tiptap
        </p>
      </div>

      <div className="grid gap-6">
        {/* Interactive Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Editor</CardTitle>
            <CardDescription>
              Try typing <code>/</code> to see slash commands, or select text to see the bubble menu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={clearContent} variant="outline" size="sm">
                Clear
              </Button>
              <Button onClick={addSampleContent} variant="outline" size="sm">
                Add Sample Content
              </Button>
            </div>
            <RichTextEditor
              initialContent={content}
              placeholder="Start typing... Use / for commands, select text for formatting options"
              onUpdate={handleUpdate}
              debounceMs={300}
              className="min-h-[300px] border rounded-lg p-4"
            />
          </CardContent>
        </Card>

        {/* Read-only Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Read-only Mode</CardTitle>
            <CardDescription>
              Content that cannot be edited
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              initialContent={readOnlyContent}
              readOnly={true}
              className="min-h-[200px] border rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
            />
          </CardContent>
        </Card>

        {/* HTML Output */}
        <Card>
          <CardHeader>
            <CardTitle>HTML Output</CardTitle>
            <CardDescription>
              The raw HTML content from the editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{content}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              What makes this editor special
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">🎯 Bubble Menu</h4>
                <p className="text-sm text-muted-foreground">
                  Select text to see formatting options appear
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚡ Slash Commands</h4>
                <p className="text-sm text-muted-foreground">
                  Type <code>/</code> to access commands quickly
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📝 Rich Formatting</h4>
                <p className="text-sm text-muted-foreground">
                  Headings, lists, tables, links, and more
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎨 Modern UI</h4>
                <p className="text-sm text-muted-foreground">
                  Clean, accessible interface with dark mode support
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 