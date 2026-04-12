/* eslint-disable @next/next/no-img-element */
"use client"

import type { ReactElement } from "react"
import { Download } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface TryOnResultPreviewProps {
  targetPreview: string | null
  resultUrl: string | null
}

export function TryOnResultPreview({ targetPreview, resultUrl }: TryOnResultPreviewProps): ReactElement {
  return (
    <Card className="min-w-0 border-border/70 bg-card/90">
      <CardHeader>
        <CardTitle className="text-2xl">Result preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium">Before</p>
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40">
              {targetPreview ? (
                <img
                  src={targetPreview}
                  alt="Uploaded target preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                  Upload your photo to preview it here.
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium">After</p>
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Generated hairstyle preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                  Generated result appears here.
                </div>
              )}
            </div>
          </div>
        </div>

        {resultUrl ? (
          <a
            href={`${resultUrl}&download=1`}
            className={buttonVariants({
              size: "lg",
              className: "h-11 w-full gap-2",
            })}
          >
            <Download className="size-4" />
            Download Result
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}
