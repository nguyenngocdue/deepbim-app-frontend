'use client'

import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import {
  BookMarked,
  GitBranch,
  Users,
  FolderOpenDot,
  FileText,
  MessageSquare,
  ClipboardCheck,
  ShieldCheck,
  User,
  Crown,
  CalendarCheck2,
  Settings,
  ClipboardList,
  Lock,
  Ban,
} from 'lucide'

const iconMap = {
  admin: { icon: ShieldCheck, color: '#f87171', text: '#f87171' },
  project: { icon: BookMarked, color: '#3b82f6', text: '#3b82f6' },
  subproject: { icon: GitBranch, color: '#6366f1', text: '#6366f1' },
  team: { icon: Users, color: '#a855f7', text: '#a855f7' },
  folder: { icon: FolderOpenDot, color: '#22c55e', text: '#22c55e' },
  file: { icon: FileText, color: '#9ca3af', text: '#9ca3af' },
  message: { icon: MessageSquare, color: '#0ea5e9', text: '#0ea5e9' },
  assignment: { icon: ClipboardCheck, color: '#f59e0b', text: '#f59e0b' },
  user: { icon: User, color: '#38bdf8', text: '#38bdf8' },
  lead: { icon: Crown, color: '#eab308', text: '#eab308' },
  manager: { icon: ShieldCheck, color: '#10b981', text: '#10b981' },
  event: { icon: CalendarCheck2, color: '#a3e635', text: '#a3e635' },
  permission: { icon: Settings, color: '#f43f5e', text: '#f43f5e' },
  action: { icon: ClipboardList, color: '#0ea5e9', text: '#0ea5e9' },
  restriction: { icon: Lock, color: '#f87171', text: '#f87171' },
  deny: { icon: Ban, color: '#9ca3af', text: '#9ca3af' },
}



const data = {
  name: 'Admin',
  type: 'admin',
  children: [
    {
      name: 'Permissions for User',
      type: 'permission',
      children: [
        { name: 'Can Create Project', type: 'action' },
        { name: 'Can Create Team', type: 'action' },
        { name: 'Can Create Event', type: 'action' },
        {
          name: 'Restrictions',
          type: 'restriction',
          children: [
            { name: 'Cannot Set Role (Admin, Manager, Lead)', type: 'deny' },
          ],
        },
      ],
    },
    {
      name: 'Project',
      type: 'project',
      children: [
        {
          name: 'SubProject',
          type: 'subproject',
          children: [
            {
              name: 'Team',
              type: 'team',
              children: [
                { name: 'Message', type: 'message' },
                { name: 'Assignment', type: 'assignment' },
                {
                  name: 'User',
                  type: 'user',
                  children: [
                    { name: 'Lead', type: 'lead' },
                    { name: 'Manager', type: 'manager' },
                    { name: 'Event', type: 'event' },
                  ],
                },
              ],
            },
            {
              name: 'Folder',
              type: 'folder',
              children: [
                { name: 'File (PDF, IFC, JSON, FDX, ...)', type: 'file' },
              ],
            },
          ],
        },
      ],
    },
  ],
}




export default function Workfolows() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const width = 1000
    const height = 500

    const root = d3.hierarchy(data)
    const tree = d3.tree().size([height - 40, width - 160])
    tree(root)

    const svg = d3.select(svgRef.current)

    svg.selectAll('*').remove()

// Group cho tổ chức layer
const linkLayer = svg.append('g').attr('class', 'links')
const customLinkLayer = svg.append('g').attr('class', 'custom-links')
const nodeLayer = svg.append('g').attr('class', 'nodes')

// Apply transform
linkLayer.attr('transform', 'translate(60,20)')
customLinkLayer.attr('transform', 'translate(60,20)')
nodeLayer.attr('transform', 'translate(60,20)')


    const g = svg
      .attr('viewBox', [0, 0, width, height])
      .append('g')
      .attr('transform', 'translate(60,20)')

    // Links
    const links = g
      .selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x)
      )

    // Animate a point on each link
    links.each(function (_, i) {
      const path = d3.select(this)
      const length = (this as SVGPathElement).getTotalLength()

      const point = g
        .append('circle')
        .attr('r', 4)
        .attr('fill', '#facc15') // yellow-400

      function animate() {
        point
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attrTween('transform', function () {
            return function (t: number) {
              const p = (path.node() as SVGPathElement).getPointAtLength(t * length)
              return `translate(${p.x},${p.y})`
            }
          })
          .on('end', animate)
      }

      animate()
    })

    //user -> sub_projec
    const allNodes = root.descendants()


    const fromTeam = allNodes.find(d => d.data.name === 'Team')
    const toUser = allNodes.find(d => d.data.name === 'Permissions for User')

    const customPath = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#f97316') // orange-500
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 2')
      .attr(
        'd',
        d3.linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x)({
            source: toUser,
            target: fromTeam,
          } as any)
      )


    if (fromTeam && toUser) {
      const length = (customPath.node() as SVGPathElement).getTotalLength()

      const point = g.append('circle')
        .attr('r', 4)
        .attr('fill', '#facc15') // yellow-400

      function animateReverse() {
        point
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attrTween('transform', function () {
            return function (t: number) {
              const p = (customPath.node() as SVGPathElement).getPointAtLength((1 - t) * length)
              return `translate(${p.x},${p.y})`
            }
          })
          .on('end', animateReverse)
      }

      animateReverse()
    }



    // Nodes
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`)

    // Background circle
    node
      .append('circle')
      .attr('r', 16)
      .attr('fill', d => iconMap[d.data.type]?.color || '#888')

    // Icon SVG from Lucide
    node.each(function (d) {
      const group = d3.select(this)
      const iconEntry = iconMap[d.data.type]
      const iconNode = iconEntry?.icon

      if (!Array.isArray(iconNode)) return

      iconNode.forEach(([tag, attrs]) => {
        const el = group.append(tag)
        Object.entries(attrs).forEach(([key, val]) => el.attr(key, val))
        el
          .attr('stroke', 'white')
          .attr('fill', 'none')
          .attr('stroke-width', 2)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .attr('transform', 'translate(-10, -10) scale(0.8)')
      })
    })


    // Label
    node
      .append('text')
      .attr('dy', '0.35em')
      .attr('x', d => (d.children ? -24 : 24))
      .attr('text-anchor', d => (d.children ? 'end' : 'start'))
     .attr('fill', d => iconMap[d.data.type]?.text || '#fff')
      .style('font-size', '13px')
      .text(d => d.data.name)
  }, [])

  return (
<div className="relative dark:bg-background text-foreground h-full flex flex-col items-center py-10 px-4 overflow-y-auto">
  <div className="text-center mb-6 max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold tracking-tight mb-2">
      Visual Workflow Hierarchy
    </h2>
    <p className="text-muted-foreground text-sm md:text-base">
      Welcome to <strong className="text-primary">DeepBIM</strong> — a platform built for companies to deploy, manage, and visualize their BIM workflows with precision and clarity.
      This interactive tree reveals how projects, teams, and permissions are structured, empowering you to gain full control over your collaboration pipeline.
    </p>
  </div>
  <svg ref={svgRef} className="w-full max-w-5xl h-[450px]" />
</div>


  )
}
