import Tab from '../../src/tab'
import { getFixture, clearFixture, jQueryMock } from '../helpers/fixture'
import { getJqueryInterfaceForPlugin } from '../../src/util/jquery-stuff'

describe('Tab', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Tab.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li><a href="#home" role="tab">Home</a></li>',
        '</ul>',
        '<ul>',
        '  <li id="home"></li>',
        '</ul>'
      ].join('')

      const tabEl = fixtureEl.querySelector('[href="#home"]')
      const tabBySelector = new Tab('[href="#home"]')
      const tabByElement = new Tab(tabEl)

      expect(tabBySelector._element).toEqual(tabEl)
      expect(tabByElement._element).toEqual(tabEl)
    })
  })

  describe('show', () => {
    it('should activate element by tab id (using buttons, the preferred semantic way)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
          '  <li><button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button></li>',
          '</ul>',
          '<ul>',
          '  <li id="home" role="tabpanel"></li>',
          '  <li id="profile" role="tabpanel"></li>',
          '</ul>'
        ].join('')

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          expect(profileTriggerEl.getAttribute('aria-selected')).toEqual('true')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id (using links for tabs - not ideal, but still supported)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><a href="#home" role="tab">Home</a></li>',
          '  <li><a id="triggerProfile" href="#profile" role="tab">Profile</a></li>',
          '</ul>',
          '<ul>',
          '  <li id="home" role="tabpanel"></li>',
          '  <li id="profile" role="tabpanel"></li>',
          '</ul>'
        ].join('')

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          expect(profileTriggerEl.getAttribute('aria-selected')).toEqual('true')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id in ordered list', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ol class="nav nav-pills">',
          '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
          '  <li><button type="button" id="triggerProfile" href="#profile" role="tab">Profile</button></li>',
          '</ol>',
          '<ol>',
          '  <li id="home" role="tabpanel"></li>',
          '  <li id="profile" role="tabpanel"></li>',
          '</ol>'
        ].join('')

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id in nav list', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="nav">',
          '  <button type="button" data-bs-target="#home" role="tab">Home</button>',
          '  <button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button>',
          '</nav>',
          '<div>',
          '  <div id="home" role="tabpanel"></div>',
          '  <div id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id in list group', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="list-group" role="tablist">',
          '  <button type="button" data-bs-target="#home" role="tab">Home</button>',
          '  <button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button>',
          '</div>',
          '<div>',
          '  <div id="home" role="tabpanel"></div>',
          '  <div id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        tab.show()
      })
    })

    it('should not fire shown when show is prevented', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="nav"></div>'

        const navEl = fixtureEl.querySelector('div')
        const tab = new Tab(navEl)
        const expectDone = () => {
          setTimeout(() => {
            expect().nothing()
            resolve()
          }, 30)
        }

        navEl.addEventListener('show.bs.tab', ev => {
          ev.preventDefault()
          expectDone()
        })

        navEl.addEventListener('shown.bs.tab', () => {
          throw new Error('should not trigger shown event')
        })

        tab.show()
      })
    })

    it('should not fire shown when tab is already active', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
          '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#profile" class="nav-link" role="tab">Profile</button></li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
          '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const triggerActive = fixtureEl.querySelector('button.active')
        const tab = new Tab(triggerActive)

        triggerActive.addEventListener('shown.bs.tab', () => {
          throw new Error('should not trigger shown event')
        })

        tab.show()
        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 30)
      })
    })

    it('show and shown events should reference correct relatedTarget', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
          '  <li class="nav-item" role="presentation"><button type="button" id="triggerProfile" data-bs-target="#profile" class="nav-link" role="tab">Profile</button></li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
          '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const secondTabTrigger = fixtureEl.querySelector('#triggerProfile')
        const secondTab = new Tab(secondTabTrigger)

        secondTabTrigger.addEventListener('show.bs.tab', ev => {
          expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#home')
        })

        secondTabTrigger.addEventListener('shown.bs.tab', ev => {
          expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#home')
          expect(secondTabTrigger.getAttribute('aria-selected')).toEqual('true')
          expect(fixtureEl.querySelector('button:not(.active)').getAttribute('aria-selected')).toEqual('false')
          resolve()
        })

        secondTab.show()
      })
    })

    it('should fire hide and hidden events', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
          '  <li><button type="button" data-bs-target="#profile">Profile</button></li>',
          '</ul>'
        ].join('')

        const triggerList = fixtureEl.querySelectorAll('button')
        const firstTab = new Tab(triggerList[0])
        const secondTab = new Tab(triggerList[1])

        let hideCalled = false
        triggerList[0].addEventListener('shown.bs.tab', () => {
          secondTab.show()
        })

        triggerList[0].addEventListener('hide.bs.tab', ev => {
          hideCalled = true
          expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#profile')
        })

        triggerList[0].addEventListener('hidden.bs.tab', ev => {
          expect(hideCalled).toBeTrue()
          expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#profile')
          resolve()
        })

        firstTab.show()
      })
    })

    it('should not fire hidden when hide is prevented', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
          '  <li><button type="button" data-bs-target="#profile" role="tab">Profile</button></li>',
          '</ul>'
        ].join('')

        const triggerList = fixtureEl.querySelectorAll('button')
        const firstTab = new Tab(triggerList[0])
        const secondTab = new Tab(triggerList[1])
        const expectDone = () => {
          setTimeout(() => {
            expect().nothing()
            resolve()
          }, 30)
        }

        triggerList[0].addEventListener('shown.bs.tab', () => {
          secondTab.show()
        })

        triggerList[0].addEventListener('hide.bs.tab', ev => {
          ev.preventDefault()
          expectDone()
        })

        triggerList[0].addEventListener('hidden.bs.tab', () => {
          throw new Error('should not trigger hidden')
        })

        firstTab.show()
      })
    })

    it('should handle removed tabs', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation">',
          '    <a class="nav-link nav-tab" href="#profile" role="tab" data-bs-toggle="tab">',
          '      <button class="btn-close" aria-label="Close"></button>',
          '    </a>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <a id="secondNav" class="nav-link nav-tab" href="#buzz" role="tab" data-bs-toggle="tab">',
          '      <button class="btn-close" aria-label="Close"></button>',
          '    </a>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <a class="nav-link nav-tab" href="#references" role="tab" data-bs-toggle="tab">',
          '      <button id="btnClose" class="btn-close" aria-label="Close"></button>',
          '    </a>',
          '  </li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div role="tabpanel" class="tab-pane fade show active" id="profile">test 1</div>',
          '  <div role="tabpanel" class="tab-pane fade" id="buzz">test 2</div>',
          '  <div role="tabpanel" class="tab-pane fade" id="references">test 3</div>',
          '</div>'
        ].join('')

        const secondNavEl = fixtureEl.querySelector('#secondNav')
        const btnCloseEl = fixtureEl.querySelector('#btnClose')
        const secondNavTab = new Tab(secondNavEl)

        secondNavEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelectorAll('.nav-tab')).toHaveSize(2)
          resolve()
        })

        btnCloseEl.addEventListener('click', () => {
          const linkEl = btnCloseEl.parentNode
          const liEl = linkEl.parentNode
          const tabId = linkEl.getAttribute('href')
          const tabIdEl = fixtureEl.querySelector(tabId)

          liEl.remove()
          tabIdEl.remove()
          secondNavTab.show()
        })

        btnCloseEl.click()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const tab = new Tab(fixtureEl.querySelector('div'))

      expect(Tab.getInstance(el)).not.toBeNull()

      tab.dispose()

      expect(Tab.getInstance(el)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should create a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.tab = getJqueryInterfaceForPlugin(Tab)
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab.getInstance(div)).not.toBeNull()
    })

    it('should not re create a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      jQueryMock.fn.tab = getJqueryInterfaceForPlugin(Tab)
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab.getInstance(div)).toEqual(tab)
    })

    it('should call a tab method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      spyOn(tab, 'show')

      jQueryMock.fn.tab = getJqueryInterfaceForPlugin(Tab)
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock, 'show')

      expect(Tab.getInstance(div)).toEqual(tab)
      expect(tab.show).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.tab = getJqueryInterfaceForPlugin(Tab)
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.tab.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return null if there is no instance', () => {
      expect(Tab.getInstance(fixtureEl)).toBeNull()
    })

    it('should return this instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const divEl = fixtureEl.querySelector('div')
      const tab = new Tab(divEl)

      expect(Tab.getInstance(divEl)).toEqual(tab)
      expect(Tab.getInstance(divEl)).toBeInstanceOf(Tab)
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return tab instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      expect(Tab.getOrCreateInstance(div)).toEqual(tab)
      expect(Tab.getInstance(div)).toEqual(Tab.getOrCreateInstance(div, {}))
      expect(Tab.getOrCreateInstance(div)).toBeInstanceOf(Tab)
    })

    it('should return new instance when there is no tab instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Tab.getInstance(div)).toBeNull()
      expect(Tab.getOrCreateInstance(div)).toBeInstanceOf(Tab)
    })
  })

  describe('data-api', () => {
    it('should create dynamically a tab', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
          '  <li class="nav-item" role="presentation"><button type="button" id="triggerProfile" data-bs-toggle="tab" data-bs-target="#profile" class="nav-link" role="tab">Profile</button></li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
          '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const secondTabTrigger = fixtureEl.querySelector('#triggerProfile')

        secondTabTrigger.addEventListener('shown.bs.tab', () => {
          expect(secondTabTrigger).toHaveClass('active')
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        secondTabTrigger.click()
      })
    })

    it('selected tab should deactivate previous selected link in dropdown', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs">',
        '  <li class="nav-item"><a class="nav-link" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#profile" data-bs-toggle="tab">Profile</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item active" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a>',
        '      <a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-bs-toggle="tab">@mdo</a>',
        '    </div>',
        '  </li>',
        '</ul>'
      ].join('')

      const firstLiLinkEl = fixtureEl.querySelector('li:first-child a')

      firstLiLinkEl.click()
      expect(firstLiLinkEl).toHaveClass('active')
      expect(fixtureEl.querySelector('li:last-child a')).not.toHaveClass('active')
      expect(fixtureEl.querySelector('li:last-child .dropdown-menu a:first-child')).not.toHaveClass('active')
    })

    it('selecting a dropdown tab does not activate another', () => {
      const nav1 = [
        '<ul class="nav nav-tabs" id="nav1">',
        '  <li class="nav-item active"><a class="nav-link" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a>',
        '    </div>',
        '  </li>',
        '</ul>'
      ].join('')
      const nav2 = [
        '<ul class="nav nav-tabs" id="nav2">',
        '  <li class="nav-item active"><a class="nav-link" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a>',
        '    </div>',
        '  </li>',
        '</ul>'
      ].join('')

      fixtureEl.innerHTML = nav1 + nav2

      const firstDropItem = fixtureEl.querySelector('#nav1 .dropdown-item')

      firstDropItem.click()
      expect(firstDropItem).toHaveClass('active')
      expect(fixtureEl.querySelector('#nav1 .dropdown-toggle')).toHaveClass('active')
      expect(fixtureEl.querySelector('#nav2 .dropdown-toggle')).not.toHaveClass('active')
      expect(fixtureEl.querySelector('#nav2 .dropdown-item')).not.toHaveClass('active')
    })

    it('should support li > .dropdown-item', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs">',
        '  <li class="nav-item"><a class="nav-link active" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#profile" data-bs-toggle="tab">Profile</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <ul class="dropdown-menu">',
        '      <li><a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a></li>',
        '      <li><a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-bs-toggle="tab">@mdo</a></li>',
        '    </ul>',
        '  </li>',
        '</ul>'
      ].join('')

      const firstDropItem = fixtureEl.querySelector('.dropdown-item')

      firstDropItem.click()
      expect(firstDropItem).toHaveClass('active')
      expect(fixtureEl.querySelector('.nav-link')).not.toHaveClass('active')
    })

    it('should handle nested tabs', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="nav nav-tabs" role="tablist">',
          '  <button type="button" id="tab1" data-bs-target="#x-tab1" class="nav-link" data-bs-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</button>',
          '  <button type="button" data-bs-target="#x-tab2" class="nav-link active" data-bs-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</button>',
          '  <button type="button" data-bs-target="#x-tab3" class="nav-link" data-bs-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</button>',
          '</nav>',
          '<div class="tab-content">',
          '  <div class="tab-pane" id="x-tab1" role="tabpanel">',
          '    <nav class="nav nav-tabs" role="tablist">',
          '      <button type="button" data-bs-target="#nested-tab1" class="nav-link active" data-bs-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</button>',
          '      <button type="button" id="tabNested2" data-bs-target="#nested-tab2" class="nav-link" data-bs-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</button>',
          '    </nav>',
          '    <div class="tab-content">',
          '      <div class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</div>',
          '      <div class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</div>',
          '    </div>',
          '  </div>',
          '  <div class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</div>',
          '  <div class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</div>',
          '</div>'
        ].join('')

        const tab1El = fixtureEl.querySelector('#tab1')
        const tabNested2El = fixtureEl.querySelector('#tabNested2')
        const xTab1El = fixtureEl.querySelector('#x-tab1')

        tabNested2El.addEventListener('shown.bs.tab', () => {
          expect(xTab1El).toHaveClass('active')
          resolve()
        })

        tab1El.addEventListener('shown.bs.tab', () => {
          expect(xTab1El).toHaveClass('active')
          tabNested2El.click()
        })

        tab1El.click()
      })
    })

    it('should not remove fade class if no active pane is present', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation"><button type="button" id="tab-home" data-bs-target="#home" class="nav-link" data-bs-toggle="tab" role="tab">Home</button></li>',
          '  <li class="nav-item" role="presentation"><button type="button" id="tab-profile" data-bs-target="#profile" class="nav-link" data-bs-toggle="tab" role="tab">Profile</button></li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div class="tab-pane fade" id="home" role="tabpanel"></div>',
          '  <div class="tab-pane fade" id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const triggerTabProfileEl = fixtureEl.querySelector('#tab-profile')
        const triggerTabHomeEl = fixtureEl.querySelector('#tab-home')
        const tabProfileEl = fixtureEl.querySelector('#profile')
        const tabHomeEl = fixtureEl.querySelector('#home')

        triggerTabProfileEl.addEventListener('shown.bs.tab', () => {
          expect(tabProfileEl).toHaveClass('fade')
          expect(tabProfileEl).toHaveClass('show')

          triggerTabHomeEl.addEventListener('shown.bs.tab', () => {
            expect(tabProfileEl).toHaveClass('fade')
            expect(tabProfileEl).not.toHaveClass('show')

            expect(tabHomeEl).toHaveClass('fade')
            expect(tabHomeEl).toHaveClass('show')

            resolve()
          })

          triggerTabHomeEl.click()
        })

        triggerTabProfileEl.click()
      })
    })

    it('should not add show class to tab panes if there is no `.fade` class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" class="nav-link nav-tab" data-bs-target="#home" role="tab" data-bs-toggle="tab">Home</button>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" id="secondNav" class="nav-link nav-tab" data-bs-target="#profile" role="tab" data-bs-toggle="tab">Profile</button>',
          '  </li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div role="tabpanel" class="tab-pane" id="home">test 1</div>',
          '  <div role="tabpanel" class="tab-pane" id="profile">test 2</div>',
          '</div>'
        ].join('')

        const secondNavEl = fixtureEl.querySelector('#secondNav')

        secondNavEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelectorAll('.show')).toHaveSize(0)
          resolve()
        })

        secondNavEl.click()
      })
    })

    it('should add show class to tab panes if there is a `.fade` class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" class="nav-link nav-tab" data-bs-target="#home" role="tab" data-bs-toggle="tab">Home</button>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" id="secondNav" class="nav-link nav-tab" data-bs-target="#profile" role="tab" data-bs-toggle="tab">Profile</button>',
          '  </li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div role="tabpanel" class="tab-pane fade" id="home">test 1</div>',
          '  <div role="tabpanel" class="tab-pane fade" id="profile">test 2</div>',
          '</div>'
        ].join('')

        const secondNavEl = fixtureEl.querySelector('#secondNav')

        secondNavEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelectorAll('.show')).toHaveSize(1)
          resolve()
        })

        secondNavEl.click()
      })
    })

    it('should prevent default when the trigger is <a> or <area>', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><a type="button" href="#test"  class="active" role="tab" data-bs-toggle="tab">Home</a></li>',
          '  <li><a type="button" href="#test2" role="tab" data-bs-toggle="tab">Home</a></li>',
          '</ul>'
        ].join('')

        const tabEl = fixtureEl.querySelector('[href="#test2"]')
        spyOn(Event.prototype, 'preventDefault').and.callThrough()

        tabEl.addEventListener('shown.bs.tab', () => {
          expect(tabEl).toHaveClass('active')
          expect(Event.prototype.preventDefault).toHaveBeenCalled()
          resolve()
        })

        tabEl.click()
      })
    })

    it('should not fire shown when tab has disabled attribute', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
          '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#profile" class="nav-link" disabled role="tab">Profile</button></li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
          '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const triggerDisabled = fixtureEl.querySelector('button[disabled]')
        triggerDisabled.addEventListener('shown.bs.tab', () => {
          throw new Error('should not trigger shown event')
        })

        triggerDisabled.click()
        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 30)
      })
    })

    it('should not fire shown when tab has disabled class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation"><a href="#home" class="nav-link active" role="tab" aria-selected="true">Home</a></li>',
          '  <li class="nav-item" role="presentation"><a href="#profile" class="nav-link disabled" role="tab">Profile</a></li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
          '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const triggerDisabled = fixtureEl.querySelector('a.disabled')

        triggerDisabled.addEventListener('shown.bs.tab', () => {
          throw new Error('should not trigger shown event')
        })

        triggerDisabled.click()
        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 30)
      })
    })
  })
})
