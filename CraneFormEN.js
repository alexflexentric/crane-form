// Mark required fields visually
			document.addEventListener('DOMContentLoaded', function () {
				var requiredClass = 'required-label';
				var updateRequiredLabels = function () {
					var fields = document.querySelectorAll('.bee-field');
					fields.forEach(function (field) {
						var fieldLabel = field.querySelector('label');
						if (!fieldLabel) {
							return;
						}
						var hasRequired = field.querySelector('input[required], select[required], textarea[required]');
						fieldLabel.classList.toggle(requiredClass, !!hasRequired);
					});
				};
				updateRequiredLabels();
				var observer = new MutationObserver(function (mutations) {
					var touched = mutations.some(function (mutation) {
						return mutation.type === 'attributes' && mutation.attributeName === 'required';
					});
					if (touched) {
						updateRequiredLabels();
					}
				});
				document.querySelectorAll('input, select, textarea').forEach(function (element) {
					observer.observe(element, { attributes: true, attributeFilter: ['required'] });
				});
			});

			// Validation 25: File field
			document.addEventListener('DOMContentLoaded', function () {
				var form = document.getElementById('landingForm');
			var fileInput = document.getElementById('r0c0m1r25f1');
			var fileNameInput = document.getElementById('FileName');
			var fileMimeInput = document.getElementById('FileMimeType');
			var fileBase64Input = document.getElementById('FileBase64');
			var fileStatus = document.getElementById('file-status');
			var MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

			if (!form || !fileInput || !fileNameInput || !fileMimeInput || !fileBase64Input) {
				return;
			}

			var resetHiddenFields = function () {
				fileNameInput.value = '';
				fileMimeInput.value = '';
				fileBase64Input.value = '';
			};

			var setStatus = function (message, isError) {
				if (!fileStatus) {
					return;
				}
				fileStatus.textContent = message || '';
				if (!message) {
					fileStatus.classList.remove('error');
					return;
				}
				if (isError) {
					fileStatus.classList.add('error');
				} else {
					fileStatus.classList.remove('error');
				}
			};

			var readFileAsBase64 = function (file) {
				return new Promise(function (resolve, reject) {
					var reader = new FileReader();
					reader.onload = function () {
						var result = String(reader.result || '');
						var commaIndex = result.indexOf(',');
						resolve(commaIndex > -1 ? result.slice(commaIndex + 1) : result);
					};
					reader.onerror = function () {
						reject(reader.error || new Error('Could not read the file.'));
					};
					reader.readAsDataURL(file);
				});
			};

			fileInput.addEventListener('change', function () {
				resetHiddenFields();
				setStatus('', false);
				if (!(fileInput.files && fileInput.files[0])) {
					fileInput.setCustomValidity('');
					return;
				}
				var file = fileInput.files[0];
				if (file.size > MAX_FILE_BYTES) {
					var message = 'File is ' + file.size + ' bytes; maximum allowed is ' + MAX_FILE_BYTES + '.';
					setStatus(message, true);
					fileInput.setCustomValidity('File must be 5 MB or smaller.');
					fileInput.value = '';
					return;
				}
				fileInput.setCustomValidity('');
				fileNameInput.value = file.name || 'upload.bin';
				fileMimeInput.value = file.type || 'application/octet-stream';
				setStatus('Preparing file...', false);

				readFileAsBase64(file).then(function (base64) {
					fileBase64Input.value = base64;
					setStatus('File is ready for submission.', false);
				}).catch(function (error) {
					console.error(error);
					resetHiddenFields();
					setStatus('Could not read the selected file.', true);
					fileInput.value = '';
					fileInput.setCustomValidity('Please select a different file.');
				});
			});

			form.addEventListener('submit', function (event) {
				var fileSelected = fileInput.files && fileInput.files[0];
				if (fileSelected && !fileBase64Input.value) {
					fileInput.setCustomValidity('File is still being prepared. Please wait.');
					fileInput.reportValidity();
					event.preventDefault();
					return;
				}
				fileInput.setCustomValidity('');
				if (!fileSelected) {
					resetHiddenFields();
					setStatus('', false);
				}
			});
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 04: Phone
			var phoneInput04 = document.getElementById('r0c0m1r4f1');
			var phoneSanitizeRegex04 = /[^0-9+\s().-]/g;
			var phoneValidateRegex04 = /^\+?[0-9\s().-]{7,}$/;
			if (phoneInput04) {
				var validatePhone04 = function () {
					phoneInput04.value = phoneInput04.value.replace(phoneSanitizeRegex04, '');
					if (phoneInput04.value === '' || !phoneValidateRegex04.test(phoneInput04.value)) {
						phoneInput04.setCustomValidity('Enter a valid phone number (digits, spaces, +, () or -).');
					} else {
						phoneInput04.setCustomValidity('');
					}
				};
				phoneInput04.addEventListener('input', validatePhone04);
				phoneInput04.addEventListener('blur', validatePhone04);
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 46: Postal code (4 digits only)
			var postalCodeInput46 = document.getElementById('r0c0m1r48f1');
			var digitOnlyRegex = /[^0-9]/g;
			if (postalCodeInput46) {
				postalCodeInput46.placeholder = '0000';
				var enforcePostalCode46 = function () {
					var sanitized = postalCodeInput46.value.replace(digitOnlyRegex, '').slice(0, 4);
					if (postalCodeInput46.value !== sanitized) {
						postalCodeInput46.value = sanitized;
					}
					if (sanitized.length === 0) {
						postalCodeInput46.setCustomValidity('');
					} else if (sanitized.length !== 4) {
						postalCodeInput46.setCustomValidity('Postal code must be exactly 4 digits.');
					} else {
						postalCodeInput46.setCustomValidity('');
					}
				};
				postalCodeInput46.addEventListener('input', enforcePostalCode46);
				postalCodeInput46.addEventListener('blur', enforcePostalCode46);
				enforcePostalCode46();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 49-50: Coordinates with mask, digits only and range check
			var coordinateXInput49 = document.getElementById('r0c0m1r51f1');
			var coordinateYInput50 = document.getElementById('r0c0m1r52f1');
			var digitsOnlyRegex = /[^0-9]/g;

			var setupCoordinateField = function (input, min, max) {
				if (!input) {
					return;
				}
				if (!input.placeholder) {
					input.placeholder = 'xxxxxx m';
				}
				var maxDigits = String(max).length;
				var rangeMessage = 'Value must be between ' + String(min) + ' and ' + String(max) + ' m.';
				var enforceMaskAndRange = function () {
					var digits = input.value.replace(digitsOnlyRegex, '').slice(0, maxDigits);
					digits = digits.replace(/^0+(?=\d)/, '');
					if (digits.length === 0) {
						input.value = '';
						input.setCustomValidity('');
						return;
					}
					input.value = digits + ' m';
					var numericValue = parseInt(digits, 10);
					if (!Number.isFinite(numericValue)) {
						input.setCustomValidity('Digits only.');
						return;
					}
					if (numericValue < min || numericValue > max) {
						input.setCustomValidity(rangeMessage);
					} else {
						input.setCustomValidity('');
					}
				};
				input.addEventListener('input', enforceMaskAndRange);
				input.addEventListener('blur', enforceMaskAndRange);
				enforceMaskAndRange();
			};

			setupCoordinateField(coordinateXInput49, 45000, 300000);
			setupCoordinateField(coordinateYInput50, 150000, 250000);
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 51-52: DMS coordinates with range enforcement
			var coordinateNInput51 = document.getElementById('r0c0m1r53f1');
			var coordinateEInput52 = document.getElementById('r0c0m1r54f1');
			var digitsOnlyRegex = /[^0-9]/g;

			var toSeconds = function (degrees, minutes, seconds) {
				return (degrees * 3600) + (minutes * 60) + seconds;
			};

			var formatRangeLabel = function (degrees, minutes, seconds) {
				var deg = String(degrees);
				var min = String(minutes).padStart(2, '0');
				var sec = String(seconds).padStart(2, '0');
				return deg + '°' + min + '′' + sec + '″';
			};

			var setupDmsField = function (input, degreeDigits, minSeconds, maxSeconds, minLabel, maxLabel) {
				if (!input) {
					return;
				}
				if (!input.placeholder) {
					input.placeholder = degreeDigits === 2 ? 'DD°MM′SS,SS″' : 'D°MM′SS,SS″';
				}
				var maxDigits = degreeDigits + 6;
				var minutesAndSecondsMessage = 'Minutes and seconds must be between 00 and 59.';
				var rangeMessage = 'Value must be between ' + minLabel + ' and ' + maxLabel + '.';
				var incompleteMessage = 'Enter the value as ' + input.placeholder + '.';
				var enforceDmsMask = function () {
					var digits = input.value.replace(digitsOnlyRegex, '').slice(0, maxDigits);
					if (digits.length === 0) {
						input.value = '';
						input.setCustomValidity('');
						return;
					}
					var degreePart = digits.slice(0, Math.min(degreeDigits, digits.length));
					var minutePart = '';
					var secondPart = '';
					var decimalPart = '';
					if (digits.length > degreeDigits) {
						minutePart = digits.slice(degreeDigits, Math.min(degreeDigits + 2, digits.length));
					}
					if (digits.length > degreeDigits + 2) {
						secondPart = digits.slice(degreeDigits + 2, Math.min(degreeDigits + 4, digits.length));
					}
					if (digits.length > degreeDigits + 4) {
						decimalPart = digits.slice(degreeDigits + 4, Math.min(degreeDigits + 6, digits.length));
					}
					var formatted = '';
					if (degreePart) {
						formatted += degreePart + '°';
					}
					if (minutePart) {
						formatted += minutePart + '′';
					}
					if (secondPart) {
						formatted += secondPart;
						if (decimalPart) {
							formatted += ',' + decimalPart;
						}
						formatted += '″';
					}
					input.value = formatted;
					if (digits.length < maxDigits) {
						input.setCustomValidity(incompleteMessage);
						return;
					}
					var degreesValue = parseInt(digits.slice(0, degreeDigits), 10);
					var minutesValue = parseInt(digits.slice(degreeDigits, degreeDigits + 2), 10);
					var secondsValue = parseInt(digits.slice(degreeDigits + 2, degreeDigits + 4), 10);
					var decimalSecondsValue = parseInt(digits.slice(degreeDigits + 4, degreeDigits + 6), 10);
					if (!Number.isFinite(degreesValue) || !Number.isFinite(minutesValue) || !Number.isFinite(secondsValue)) {
						input.setCustomValidity('Digits only.');
						return;
					}
					if (!Number.isFinite(decimalSecondsValue)) {
						input.setCustomValidity('Digits only.');
						return;
					}
					if (minutesValue > 59 || secondsValue > 59) {
						input.setCustomValidity(minutesAndSecondsMessage);
						return;
					}
					var totalSeconds = toSeconds(degreesValue, minutesValue, 0) + secondsValue + (decimalSecondsValue / 100);
					if (totalSeconds < minSeconds || totalSeconds > maxSeconds) {
						input.setCustomValidity(rangeMessage);
					} else {
						input.setCustomValidity('');
					}
				};
				input.addEventListener('input', enforceDmsMask);
				input.addEventListener('blur', enforceDmsMask);
				enforceDmsMask();
			};

			setupDmsField(
				coordinateNInput51,
				2,
				toSeconds(49, 30, 0),
				toSeconds(51, 30, 0),
				formatRangeLabel(49, 30, 0),
				formatRangeLabel(51, 30, 0)
			);
			setupDmsField(
				coordinateEInput52,
				1,
				toSeconds(2, 30, 0),
				toSeconds(6, 30, 0),
				formatRangeLabel(2, 30, 0),
				formatRangeLabel(6, 30, 0)
			);
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Auto-fill 53: Applicant name = First name + Last name (read-only)
			var firstNameInput01 = document.getElementById('r0c0m1r1f1');
			var lastNameInput02 = document.getElementById('r0c0m1r2f1');
			var applicantNameInput53 = document.getElementById('r0c0m1r55f1');
			if (!applicantNameInput53) {
				return;
			}
			applicantNameInput53.readOnly = true;
			var updateApplicantName53 = function () {
				var firstName = firstNameInput01 ? firstNameInput01.value.trim() : '';
				var lastName = lastNameInput02 ? lastNameInput02.value.trim() : '';
				var combined = [firstName, lastName].filter(Boolean).join(' ');
				applicantNameInput53.value = combined;
			};
			if (firstNameInput01) {
				firstNameInput01.addEventListener('input', updateApplicantName53);
				firstNameInput01.addEventListener('change', updateApplicantName53);
			}
			if (lastNameInput02) {
				lastNameInput02.addEventListener('input', updateApplicantName53);
				lastNameInput02.addEventListener('change', updateApplicantName53);
			}
			updateApplicantName53();
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 05: Email
			var emailInput05 = document.getElementById('r0c0m1r5f1');
			var emailValidateRegex05 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (emailInput05) {
				var validateEmail05 = function () {
					if (emailInput05.value === '' || !emailValidateRegex05.test(emailInput05.value)) {
						emailInput05.setCustomValidity('Enter a valid email address (example@domain.com).');
					} else {
						emailInput05.setCustomValidity('');
					}
				};
				emailInput05.addEventListener('input', validateEmail05);
				emailInput05.addEventListener('blur', validateEmail05);
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 08: Phone
			var phoneInput08 = document.getElementById('r0c0m1r8f1');
			var phoneSanitizeRegex08 = /[^0-9+\s().-]/g;
			var phoneValidateRegex08 = /^\+?[0-9\s().-]{7,}$/;
			if (phoneInput08) {
				var validatePhone08 = function () {
					phoneInput08.value = phoneInput08.value.replace(phoneSanitizeRegex08, '');
					if (phoneInput08.value === '' || !phoneValidateRegex08.test(phoneInput08.value)) {
						phoneInput08.setCustomValidity('Enter a valid phone number (digits, spaces, +, () or -).');
					} else {
						phoneInput08.setCustomValidity('');
					}
				};
				phoneInput08.addEventListener('input', validatePhone08);
				phoneInput08.addEventListener('blur', validatePhone08);
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Show 23a and make it required when "Other" is selected for field 23
			var otherValue23 = 'cc1a683c-58a4-4567-93bf-979be6e19a9c';
			var otherDescriptionInput23a = document.getElementById('r0c0m1r23af1');
			var otherDescriptionWrapper23a = otherDescriptionInput23a ? otherDescriptionInput23a.closest('.bee-field') : null;
			var typeRadios23 = document.querySelectorAll('input[name="CRANE_23_TypeOfObject"]');
			if (otherDescriptionInput23a && otherDescriptionWrapper23a && typeRadios23.length > 0) {
				var updateOtherVisibility23a = function () {
					var selectedOther = false;
					typeRadios23.forEach(function (radio) {
						if (radio.checked && radio.value === otherValue23) {
							selectedOther = true;
						}
					});
					otherDescriptionWrapper23a.style.display = selectedOther ? '' : 'none';
					otherDescriptionInput23a.required = selectedOther;
					if (selectedOther && otherDescriptionInput23a.value.trim() === '') {
						otherDescriptionInput23a.setCustomValidity('Please describe the object when Other is selected.');
					} else {
						otherDescriptionInput23a.setCustomValidity('');
					}
				};
				typeRadios23.forEach(function (radio) {
					radio.addEventListener('change', updateOtherVisibility23a);
				});
				otherDescriptionInput23a.addEventListener('input', updateOtherVisibility23a);
				otherDescriptionInput23a.addEventListener('blur', updateOtherVisibility23a);
				updateOtherVisibility23a();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Auto-select field 34 based on field 23 choice
			var typeRadios23 = document.querySelectorAll('input[name="CRANE_23_TypeOfObject"]');
			var radiusOperatingAreaValue34 = 'c7ea4900-add7-4ddb-86f1-a3c7e413c1a4';
			var turningCircleValue34 = 'b66fb09e-f82d-46ec-9852-b1f048f3fc57';
			var radiusValue34 = '1cb1f375-b9de-408a-b888-e7454135e2f3';
			var mapping23To34 = {
				// Radius
				'9d41cd50-e9c6-42a9-97bb-504727edcca6': radiusValue34, // Excavator
				'9975fd85-f67e-4dfd-b01e-80d05e82e99c': radiusValue34, // Truck mounted crane
				'4c05acdf-2c65-4353-9699-93e8f41312b2': radiusValue34, // Elevator
				'd79953b5-b276-431e-8a0d-94918e351bb5': radiusValue34, // Pile Driver
				'4b6fbe37-dfb3-43a8-b839-966991abd4e8': radiusValue34, // Drill Tower
				'754a2090-66e7-4e68-b0c2-bfe4876aac37': radiusValue34, // Telescopic crane
				'88e6b2cb-4a58-438b-96db-c73d5787c411': radiusValue34, // Concrete pump
				// Turning circle
				'3a867adc-9cb6-451b-b129-7762a4c565a0': turningCircleValue34, // Fast erecting crane
				'59cf23e9-7290-4eca-9e00-828fbfae4226': turningCircleValue34, // Tower crane
				'a3ff230c-10b7-42bf-b9db-a818b6909dca': turningCircleValue34, // Mobile tower crane
				// Radius (operating area)
				'cc1a683c-58a4-4567-93bf-979be6e19a9c': radiusOperatingAreaValue34, // Other (describe)
				'f1657cca-2c13-4568-8207-e5caf9c07332': radiusOperatingAreaValue34, // Dump Truck
				'66bab9fc-1551-4160-8ae8-ed8767b86844': radiusOperatingAreaValue34 // Drilling Machine
			};
			var setField34 = function (targetValue) {
				var targetRadio = document.querySelector('input[name="CRANE_34_CircleRadius"][value="' + targetValue + '"]');
				if (!targetRadio) {
					return;
				}
				targetRadio.checked = true;
				targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
			};
			if (typeRadios23.length > 0) {
				var updateField34 = function () {
					var selectedValue = null;
					typeRadios23.forEach(function (radio) {
						if (radio.checked) {
							selectedValue = radio.value;
						}
					});
					if (selectedValue && mapping23To34[selectedValue]) {
						setField34(mapping23To34[selectedValue]);
					}
				};
				typeRadios23.forEach(function (radio) {
					radio.addEventListener('change', updateField34);
				});
				updateField34();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Make field 34 read-only (value controlled by field 23)
			var field34Wrapper = document.querySelector('.bee-field-r0c0m1r34f1');
			var field34Radios = document.querySelectorAll('input[name="CRANE_34_CircleRadius"]');
			if (field34Wrapper && field34Radios.length > 0) {
				field34Wrapper.classList.add('readonly-field');
				field34Radios.forEach(function (radio) {
					radio.tabIndex = -1;
					radio.addEventListener('mousedown', function (e) {
						e.preventDefault();
					});
					radio.addEventListener('keydown', function (e) {
						e.preventDefault();
					});
				});
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Toggle 34a/35/36/37/38 based on field 34 selection
			var turningCircleValue34 = 'b66fb09e-f82d-46ec-9852-b1f048f3fc57';
			var radiusValue34 = '1cb1f375-b9de-408a-b888-e7454135e2f3';
			var radiusOperatingAreaValue34 = 'c7ea4900-add7-4ddb-86f1-a3c7e413c1a4';
			var field34Radios = document.querySelectorAll('input[name="CRANE_34_CircleRadius"]');
			var turningTargets = [
				{ input: document.getElementById('r0c0m1r34af1') },
				{ input: document.getElementById('r0c0m1r37f1') },
				{ input: document.getElementById('r0c0m1r38f1') },
				{ input: document.getElementById('r0c0m1r39f1') },
				{
					radios: document.querySelectorAll('input[name="CRANE_38_AGLorTAW"]'),
					wrapper: document.querySelector('.bee-field-r0c0m1r40f1')
				}
			];
			var radiusTarget = { input: document.getElementById('r0c0m1r35f1') };
			var radiusOperatingTarget = { input: document.getElementById('r0c0m1r36f1') };
			var allTargets = turningTargets.concat([radiusTarget, radiusOperatingTarget]);

			allTargets.forEach(function (target) {
				if (target.input && !target.wrapper) {
					target.wrapper = target.input.closest('.bee-field');
				}
			});
			var setRequiredAndVisibility = function (entries, visible) {
				entries.forEach(function (target) {
					if (!target) {
						return;
					}
					if (target.wrapper) {
						target.wrapper.style.display = visible ? '' : 'none';
					}
					if (target.input) {
						target.input.required = visible;
						if (!visible) {
							target.input.setCustomValidity('');
						}
					}
					if (target.radios) {
						target.radios.forEach(function (radio) {
							radio.required = visible;
							if (!visible) {
								radio.setCustomValidity('');
							}
						});
					}
				});
			};
			var updateTurningFields = function () {
				var selectedValue = null;
				field34Radios.forEach(function (radio) {
					if (radio.checked) {
						selectedValue = radio.value;
					}
				});
				var isTurning = selectedValue === turningCircleValue34;
				var isRadius = selectedValue === radiusValue34;
				var isRadiusOperating = selectedValue === radiusOperatingAreaValue34;
				setRequiredAndVisibility(turningTargets, isTurning);
				setRequiredAndVisibility([radiusTarget], isRadius);
				setRequiredAndVisibility([radiusOperatingTarget], isRadiusOperating);
			};
			if (field34Radios.length > 0) {
				field34Radios.forEach(function (radio) {
					radio.addEventListener('change', updateTurningFields);
				});
				updateTurningFields();
			} else {
				setRequiredAndVisibility(turningTargets, false);
				setRequiredAndVisibility([radiusTarget], false);
				setRequiredAndVisibility([radiusOperatingTarget], false);
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Show field 39 based on field 23 selection
			var showField39Values = [
				'754a2090-66e7-4e68-b0c2-bfe4876aac37', // Telescopic crane
				'9975fd85-f67e-4dfd-b01e-80d05e82e99c', // Truck mounted crane
				'cc1a683c-58a4-4567-93bf-979be6e19a9c'  // Other (describe)
			];
			var typeRadios23 = document.querySelectorAll('input[name="CRANE_23_TypeOfObject"]');
			var field39Radios = document.querySelectorAll('input[name="CRANE_39_IsThereAsecondaryJib"]');
			var field39Wrapper = document.querySelector('.bee-field-r0c0m1r41f1');
			if (typeRadios23.length > 0 && field39Wrapper && field39Radios.length > 0) {
				var updateField39Visibility = function () {
					var selectedValue = null;
					typeRadios23.forEach(function (radio) {
						if (radio.checked) {
							selectedValue = radio.value;
						}
					});
					var shouldShow = selectedValue && showField39Values.indexOf(selectedValue) !== -1;
					field39Wrapper.style.display = shouldShow ? '' : 'none';
					field39Radios.forEach(function (radio) {
						radio.required = shouldShow;
						if (shouldShow) {
							radio.setAttribute('required', '');
						} else {
							radio.removeAttribute('required');
						}
						if (!shouldShow) {
							radio.checked = false;
							radio.setCustomValidity('');
						}
					});
				};
				typeRadios23.forEach(function (radio) {
					radio.addEventListener('change', updateField39Visibility);
				});
				updateField39Visibility();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Show fields 41/42 based on field 23 selection
			var showField42Values = [
				'4c05acdf-2c65-4353-9699-93e8f41312b2', // Elevator
				'754a2090-66e7-4e68-b0c2-bfe4876aac37', // Telescopic crane
				'9975fd85-f67e-4dfd-b01e-80d05e82e99c', // Truck mounted crane
				'cc1a683c-58a4-4567-93bf-979be6e19a9c', // Other (describe)
				'3a867adc-9cb6-451b-b129-7762a4c565a0', // Fast erecting crane
				'59cf23e9-7290-4eca-9e00-828fbfae4226', // Tower crane
				'a3ff230c-10b7-42bf-b9db-a818b6909dca'  // Mobile tower crane
			];
			var typeRadios23For41 = document.querySelectorAll('input[name="CRANE_23_TypeOfObject"]');
			var field41Input = document.getElementById('r0c0m1r43f1'); // CRANE: 41 How high lifted
			var field41Wrapper = field41Input ? field41Input.closest('.bee-field') : null;
			var field42Radios = document.querySelectorAll('input[name="CRANE_42_AGLorTAW"]'); // CRANE: 42 AGL or TAW
			var field42Wrapper = document.querySelector('.bee-field-r0c0m1r44f1');

			var setInputVisibilityAndRequired = function (input, wrapper, visible) {
				if (!input || !wrapper) {
					return;
				}
				wrapper.style.display = visible ? '' : 'none';
				input.required = visible;
				if (visible) {
					input.setAttribute('required', '');
				} else {
					input.removeAttribute('required');
					input.setCustomValidity('');
				}
			};

			var setRadioVisibilityAndRequired = function (radios, wrapper, visible) {
				if (!wrapper || !radios || radios.length === 0) {
					return;
				}
				wrapper.style.display = visible ? '' : 'none';
				radios.forEach(function (radio) {
					radio.required = visible;
					if (visible) {
						radio.setAttribute('required', '');
					} else {
						radio.removeAttribute('required');
						radio.checked = false;
						radio.setCustomValidity('');
					}
				});
			};

			if (typeRadios23For41.length > 0 && field41Input && field41Wrapper && field42Wrapper && field42Radios.length > 0) {
				var updateField41and42 = function () {
					var selectedValue = null;
					typeRadios23For41.forEach(function (radio) {
						if (radio.checked) {
							selectedValue = radio.value;
						}
					});
					var shouldShow = selectedValue && showField42Values.indexOf(selectedValue) !== -1;
					setInputVisibilityAndRequired(field41Input, field41Wrapper, shouldShow);
					setRadioVisibilityAndRequired(field42Radios, field42Wrapper, shouldShow);
				};
				typeRadios23For41.forEach(function (radio) {
					radio.addEventListener('change', updateField41and42);
				});
				updateField41and42();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 09-10: Description required when Project name is filled
			var projectNameInput09 = document.getElementById('r0c0m1r9f1');
			var descriptionInput10 = document.getElementById('r0c0m1r10f1');
			if (projectNameInput09 && descriptionInput10) {
				var enforceDescriptionRequirement10 = function () {
					var hasProjectName = projectNameInput09.value.trim() !== '';
					descriptionInput10.required = hasProjectName;
					if (hasProjectName && descriptionInput10.value.trim() === '') {
						descriptionInput10.setCustomValidity('Description is required when Project name is provided.');
					} else {
						descriptionInput10.setCustomValidity('');
					}
				};
				projectNameInput09.addEventListener('input', enforceDescriptionRequirement10);
				projectNameInput09.addEventListener('change', enforceDescriptionRequirement10);
				descriptionInput10.addEventListener('input', enforceDescriptionRequirement10);
				descriptionInput10.addEventListener('blur', enforceDescriptionRequirement10);
				enforceDescriptionRequirement10();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Show 33 and make it required when field 32 is "YES" (value match)
			var yesValue32 = '63e65d47-07fb-4a0b-9244-1f4bdf08bdb3';
			var modifiedHeightInput33 = document.getElementById('r0c0m1r33f1');
			var modifiedHeightWrapper33 = modifiedHeightInput33 ? modifiedHeightInput33.closest('.bee-field') : null;
			var heightRadios32 = document.querySelectorAll('input[name="CRANE_32_HeightWillBeModified"]');
			if (modifiedHeightInput33 && modifiedHeightWrapper33 && heightRadios32.length > 0) {
				var updateModifiedHeightVisibility33 = function () {
					var selectedYes = false;
					heightRadios32.forEach(function (radio) {
						if (radio.checked && radio.value === yesValue32) {
							selectedYes = true;
						}
					});
					modifiedHeightWrapper33.style.display = selectedYes ? '' : 'none';
					modifiedHeightInput33.required = selectedYes;
					if (selectedYes && modifiedHeightInput33.value.trim() === '') {
						modifiedHeightInput33.setCustomValidity('Please provide the modified height.');
					} else {
						modifiedHeightInput33.setCustomValidity('');
					}
				};
				heightRadios32.forEach(function (radio) {
					radio.addEventListener('change', updateModifiedHeightVisibility33);
				});
				modifiedHeightInput33.addEventListener('input', updateModifiedHeightVisibility33);
				modifiedHeightInput33.addEventListener('blur', updateModifiedHeightVisibility33);
				updateModifiedHeightVisibility33();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Show/hide Lambert vs WGS84 coordinate fields based on field 48
			var lambertValue48 = '079fe560-252c-4ed6-84d7-8e673985d9aa';
			var wgsValue48 = '75179fab-7f15-47d3-8674-a2ac023b5cfc';
			var coordRadios48 = document.querySelectorAll('input[name="CRANE_48_ExactLocationCoordinates"]');
			var field49 = document.getElementById('r0c0m1r51f1');
			var field50 = document.getElementById('r0c0m1r52f1');
			var field51 = document.getElementById('r0c0m1r53f1');
			var field52 = document.getElementById('r0c0m1r54f1');
			var wrappers = {
				lambert: [
					{ input: field49, wrapper: field49 ? field49.closest('.bee-field') : null },
					{ input: field50, wrapper: field50 ? field50.closest('.bee-field') : null }
				],
				wgs: [
					{ input: field51, wrapper: field51 ? field51.closest('.bee-field') : null },
					{ input: field52, wrapper: field52 ? field52.closest('.bee-field') : null }
				]
			};
			var setVisibility = function (entries, visible) {
				entries.forEach(function (entry) {
					if (!entry || !entry.wrapper || !entry.input) {
						return;
					}
					entry.wrapper.style.display = visible ? '' : 'none';
					entry.input.required = visible;
					if (!visible) {
						entry.input.setCustomValidity('');
					}
				});
			};
			var updateCoordinateVisibility48 = function () {
				var selectedValue = null;
				coordRadios48.forEach(function (radio) {
					if (radio.checked) {
						selectedValue = radio.value;
					}
				});
				if (selectedValue === lambertValue48) {
					setVisibility(wrappers.lambert, true);
					setVisibility(wrappers.wgs, false);
					return;
				}
				if (selectedValue === wgsValue48) {
					setVisibility(wrappers.lambert, false);
					setVisibility(wrappers.wgs, true);
					return;
				}
				setVisibility(wrappers.lambert, false);
				setVisibility(wrappers.wgs, false);
			};
			if (coordRadios48.length > 0) {
				coordRadios48.forEach(function (radio) {
					radio.addEventListener('change', updateCoordinateVisibility48);
				});
				updateCoordinateVisibility48();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 21: Working hours from
			var timeInput21 = document.getElementById('r0c0m1r21f1');
			var timeDigitsRegex21 = /[^0-9]/g;
			var timeValidateRegex21 = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
			if (timeInput21) {
				var formatTime21 = function (value) {
					var digits = value.replace(timeDigitsRegex21, '').slice(0, 4);
					if (digits.length >= 3) {
						return digits.slice(0, 2) + ':' + digits.slice(2);
					}
					return digits;
				};
				var validateTime21 = function () {
					timeInput21.value = formatTime21(timeInput21.value);
					if (timeInput21.value === '' || !timeValidateRegex21.test(timeInput21.value)) {
						timeInput21.setCustomValidity('Enter the start time as hh:mm between 00:00 and 23:59.');
					} else {
						timeInput21.setCustomValidity('');
					}
				};
				timeInput21.addEventListener('input', validateTime21);
				timeInput21.addEventListener('blur', validateTime21);
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 22: Working hours until
			var timeInput22 = document.getElementById('r0c0m1r22f1');
			var timeInput21ForComparison = document.getElementById('r0c0m1r21f1');
			var timeDigitsRegex22 = /[^0-9]/g;
			var timeValidateRegex22 = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
			if (timeInput22) {
				var formatTime22 = function (value) {
					var digits = value.replace(timeDigitsRegex22, '').slice(0, 4);
					if (digits.length >= 3) {
						return digits.slice(0, 2) + ':' + digits.slice(2);
					}
					return digits;
				};
				var toMinutes = function (value) {
					var parts = value.split(':');
					return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
				};
				var validateTime22 = function () {
					timeInput22.value = formatTime22(timeInput22.value);
					if (timeInput22.value === '' || !timeValidateRegex22.test(timeInput22.value)) {
						timeInput22.setCustomValidity('Enter the end time as hh:mm between 00:00 and 23:59.');
						return;
					}
					if (timeInput21ForComparison && timeValidateRegex22.test(timeInput21ForComparison.value)) {
						if (toMinutes(timeInput22.value) <= toMinutes(timeInput21ForComparison.value)) {
							timeInput22.setCustomValidity('Working hours until must be later than working hours from.');
							return;
						}
					}
					timeInput22.setCustomValidity('');
				};
				timeInput22.addEventListener('input', validateTime22);
				timeInput22.addEventListener('blur', validateTime22);
				if (timeInput21ForComparison) {
					timeInput21ForComparison.addEventListener('input', validateTime22);
					timeInput21ForComparison.addEventListener('blur', validateTime22);
				}
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Prefill 12: Application date
			var applicationDateInput = document.getElementById('r0c0m1r12f1');
			if (applicationDateInput) {
				var today = new Date();
				var year = today.getFullYear();
				var month = String(today.getMonth() + 1).padStart(2, '0');
				var day = String(today.getDate()).padStart(2, '0');
				applicationDateInput.value = year + '-' + month + '-' + day;
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Warning 19: Start date within 30 days
			var startDateInput = document.getElementById('r0c0m1r19f1');
			var startDateWarning = document.getElementById('start-date-warning');
			if (startDateInput && startDateWarning) {
				var checkStartDate = function () {
					if (!startDateInput.value) {
						startDateWarning.style.display = 'none';
						return;
					}
					var selectedDate = new Date(startDateInput.value);
					if (isNaN(selectedDate)) {
						startDateWarning.style.display = 'none';
						return;
					}
					var today = new Date();
					today.setHours(0, 0, 0, 0);
					var threshold = new Date(today);
					threshold.setDate(threshold.getDate() + 30);
					if (selectedDate < threshold) {
						startDateWarning.style.display = 'block';
					} else {
						startDateWarning.style.display = 'none';
					}
				};
				startDateInput.addEventListener('input', checkStartDate);
				startDateInput.addEventListener('change', checkStartDate);
				checkStartDate();
			}
		});

		document.addEventListener('DOMContentLoaded', function () {
			// Validation 20: End date not before start date
			var startDateInput19 = document.getElementById('r0c0m1r19f1');
			var endDateInput20 = document.getElementById('r0c0m1r20f1');
			if (startDateInput19 && endDateInput20) {
				var validateEndDate20 = function () {
					if (!endDateInput20.value) {
						endDateInput20.setCustomValidity('');
						return;
					}
					if (startDateInput19.value) {
						var startDate = new Date(startDateInput19.value);
						var endDate = new Date(endDateInput20.value);
						if (!isNaN(startDate) && !isNaN(endDate) && endDate < startDate) {
							endDateInput20.setCustomValidity('End date must be on or after the start date.');
							return;
						}
					}
					endDateInput20.setCustomValidity('');
				};
				endDateInput20.addEventListener('input', validateEndDate20);
				endDateInput20.addEventListener('change', validateEndDate20);
				startDateInput19.addEventListener('input', validateEndDate20);
				startDateInput19.addEventListener('change', validateEndDate20);
				validateEndDate20();
			}
		});
