import * as React from 'react'
import {
  Paragraph,
  Link,
  SideSheet,
  Position,
  majorScale
} from '@treygriffith/evergreen-ui'

interface VideoLinkProps {
  videoUrl: string
}

interface VideoLinkState {
  isOpen: boolean
}

class VideoLink extends React.Component<VideoLinkProps, VideoLinkState> {
  constructor(props: VideoLinkProps) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  handleOpenClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault()
    this.setState({ isOpen: true })
  }

  render(): React.ReactNode {
    const { videoUrl } = this.props
    const { isOpen } = this.state

    if (!videoUrl) return null

    return (
      <Paragraph color='muted' marginTop={majorScale(2)} textAlign='center'>
        Having trouble?{' '}
        <Link
          href={videoUrl}
          target='_blank'
          onClick={this.handleOpenClick}
          rel='noreferrer'
        >
          Watch a video guide
        </Link>
        <SideSheet
          isShown={isOpen}
          position={Position.BOTTOM}
          onCloseComplete={() => this.setState({ isOpen: false })}
          containerProps={{
            paddingLeft: majorScale(5),
            paddingRight: majorScale(5),
            paddingBottom: majorScale(5),
            backgroundColor: 'transparent'
          }}
        >
          <video width='100%' autoPlay={isOpen} muted controls>
            <source src={videoUrl} type='video/mp4' />
            Your browser does not support HTML5 video.
          </video>
        </SideSheet>
      </Paragraph>
    )
  }
}

export default VideoLink
