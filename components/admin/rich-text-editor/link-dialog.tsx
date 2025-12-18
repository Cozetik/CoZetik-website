'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface LinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string, openInNewTab: boolean) => void
  initialUrl?: string
  initialOpenInNewTab?: boolean
}

export function LinkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialOpenInNewTab = false,
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl)
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url, openInNewTab)
      setUrl('')
      setOpenInNewTab(false)
      onClose()
    }
  }

  const handleClose = () => {
    setUrl(initialUrl)
    setOpenInNewTab(initialOpenInNewTab)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un lien</DialogTitle>
            <DialogDescription>
              Entrez l&apos;URL du lien que vous souhaitez ajouter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://exemple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-tab"
                checked={openInNewTab}
                onCheckedChange={(checked) =>
                  setOpenInNewTab(checked === true)
                }
              />
              <Label
                htmlFor="new-tab"
                className="text-sm font-normal cursor-pointer"
              >
                Ouvrir dans un nouvel onglet
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
